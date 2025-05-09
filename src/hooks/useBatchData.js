import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { calculateMetrics } from '../utils/calculateMetrics';

export const useBatchData = () => {
  const [data, setData] = useState([]);
  const [currentShift, setCurrentShift] = useState('');
  const [totals, setTotals] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const determineCurrentShift = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'Morning';
    if (hour >= 14 && hour < 22) return 'Afternoon';
    return 'Evening';
  };

  // Helper function to format date as YYYY-MM-DD
  const formatDateToYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get the day of the week from a date string
  const getDayOfWeek = (dateString) => {
    const dateParts = dateString.split('-');
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 12);
    return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York' });
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const todayStr = formatDateToYMD(today);

      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - 6);
      const pastDateStr = formatDateToYMD(pastDate);

      console.log('Date range for query:', { pastDateStr, todayStr });

      const shift = determineCurrentShift();
      setCurrentShift(shift);

      // Fetch current shift data for today from batch_data, filtered by shift
      const { data: batchDataToday, error: batchErrorToday } = await supabase
        .from('batch_data')
        .select('*, shift, submission_time, effective_date')
        .eq('effective_date', todayStr)
        .eq('shift', shift)
        .order('submission_time', { ascending: false });

      if (batchErrorToday) throw batchErrorToday;

      console.log('Current shift data for', todayStr, 'and shift', shift, ':', batchDataToday);

      // Combine rows with the same line, batch_number, and effective_date for today's data
      const groupedDataToday = batchDataToday.reduce((acc, row) => {
        if (!row.line || !row.batch_number || !row.effective_date) {
          return acc;
        }
        const key = `${row.line}-${row.batch_number}-${row.effective_date}`;
        if (!acc[key]) {
          acc[key] = {
            ...row,
            employee_count: 0,
            total_time: 0,
            target_units: 0,
            actual_units: 0,
          };
        }
        acc[key].employee_count = Math.max(acc[key].employee_count, row.employee_count || 0);
        acc[key].total_time += row.total_time || 0;
        acc[key].target_units += row.target_units || 0;
        acc[key].actual_units += row.actual_units || 0;
        return acc;
      }, {});

      const combinedDataToday = Object.values(groupedDataToday);

      // Process combined data with calculateMetrics
      let processedData = [];
      try {
        processedData = combinedDataToday.map((row, index) => {
          try {
            const metrics = calculateMetrics(row);
            return { ...row, ...metrics };
          } catch (err) {
            console.error(`Error in calculateMetrics for row ${index}:`, row, err);
            return row;
          }
        });
      } catch (err) {
        console.error('Error processing batch data:', err);
        throw new Error('Failed to process batch data');
      }

      console.log('Processed data (combined):', processedData);

      setData(processedData);

      // Calculate totals for current shift
      const totals = processedData.reduce(
        (acc, row) => ({
          employee_count: acc.employee_count + (row.employee_count || 0),
          total_labor_hours: acc.total_labor_hours + (row.total_labor_hours || 0),
          target_units: acc.target_units + (row.target_units || 0),
          actual_units: acc.actual_units + (row.actual_units || 0),
          unit_delta: acc.unit_delta + (row.unit_delta || 0),
          target_percentage_sum: acc.target_percentage_sum + (row.target_percentage || 0),
          count: acc.count + 1,
        }),
        { 
          employee_count: 0, 
          total_labor_hours: 0, 
          target_units: 0, 
          actual_units: 0, 
          unit_delta: 0, 
          target_percentage_sum: 0, 
          count: 0 
        }
      );

      totals.target_percentage = totals.count > 0 ? totals.target_percentage_sum / totals.count : 0;
      totals.uplh = totals.total_labor_hours > 0 ? totals.actual_units / totals.total_labor_hours : 0;
      delete totals.target_percentage_sum;
      delete totals.count;

      console.log('Calculated totals:', totals);

      setTotals(totals);

      // Fetch last 7 days of data from batch_data
      const { data: weeklyBatchData, error: weeklyBatchError } = await supabase
        .from('batch_data')
        .select('line, batch_number, effective_date, actual_units')
        .gte('effective_date', pastDateStr)
        .lte('effective_date', todayStr)
        .order('effective_date', { ascending: true });

      if (weeklyBatchError) throw weeklyBatchError;

      console.log('Weekly batch data (raw) for', pastDateStr, 'to', todayStr, ':', weeklyBatchData);

      // Combine rows with the same line, batch_number, and effective_date
      const dataWithDays = weeklyBatchData.map(row => ({
        ...row,
        day: getDayOfWeek(row.effective_date)
      }));

      const groupedData = dataWithDays.reduce((acc, row) => {
        if (!row.line || !row.batch_number || !row.effective_date || typeof row.actual_units !== 'number') {
          return acc;
        }
        const key = `${row.line}-${row.batch_number}-${row.effective_date}`;
        if (!acc[key]) {
          acc[key] = { ...row, actual_units: 0 };
        }
        acc[key].actual_units += row.actual_units;
        return acc;
      }, {});

      const combinedData = Object.values(groupedData);

      console.log('Combined weekly data:', combinedData);

      // Aggregate by day for WeeklyChart
      const aggregatedData = combinedData.reduce((acc, row) => {
        const existing = acc.find(item => item.day === row.day);
        if (existing) {
          existing.actual_units += row.actual_units;
        } else {
          acc.push({ day: row.day, actual_units: row.actual_units, effective_date: row.effective_date });
        }
        return acc;
      }, []);

      // Ensure all 7 days are represented, even if no data
      const allDays = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = formatDateToYMD(date);
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York' });

        const dayData = aggregatedData.find(d => d.effective_date === dateStr) || {
          effective_date: dateStr,
          day: dayLabel,
          actual_units: 0,
        };
        allDays[i] = dayData;
      }
      allDays.reverse();

      console.log('Final weekly data (allDays):', allDays);

      setWeeklyData(allDays);
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return { data, currentShift, totals, weeklyData, loading, error };
};