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
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate today's date in EST/EDT (America/New_York timezone)
      const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
      console.log('Raw today date:', today);

      const todayStr = formatDateToYMD(today);

      // Calculate date 7 days ago
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - 6); // Last 7 days including today
      const pastDateStr = formatDateToYMD(pastDate);

      console.log('Date range for query:', { pastDateStr, todayStr });

      const shift = determineCurrentShift();
      setCurrentShift(shift);

      // Fetch current shift data for today from batch_data, filtered by shift
      const { data: batchData, error: batchError } = await supabase
        .from('batch_data')
        .select('*, shift, submission_time, effective_date')
        .eq('effective_date', todayStr)
        .eq('shift', shift)
        .order('submission_time', { ascending: false });

      if (batchError) throw batchError;

      console.log('Current shift data for', todayStr, 'and shift', shift, ':', batchData);

      // Process current shift data with error handling
      let processedData = [];
      try {
        processedData = batchData.map((row, index) => {
          try {
            const metrics = calculateMetrics(row);
            return { ...row, ...metrics };
          } catch (err) {
            console.error(`Error in calculateMetrics for row ${index}:`, row, err);
            return row; // Fallback to row without metrics
          }
        });
      } catch (err) {
        console.error('Error processing batch data:', err);
        throw new Error('Failed to process batch data');
      }

      console.log('Processed data:', processedData);

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

      // Fetch weekly data from weekly_batch_summary for the last 7 days
      const { data: weeklySummaryData, error: weeklyError } = await supabase
        .from('weekly_batch_summary')
        .select('effective_date, actual_units')
        .gte('effective_date', pastDateStr)
        .lte('effective_date', todayStr)
        .order('effective_date', { ascending: true });

      if (weeklyError) throw weeklyError;

      console.log('Weekly summary data (raw) for', pastDateStr, 'to', todayStr, ':', weeklySummaryData);

      // Fallback: Calculate today's actual_units from batch_data if not in weekly_summary
      let augmentedWeeklyData = [...weeklySummaryData];
      const todaySummary = weeklySummaryData.find(d => d.effective_date === todayStr);
      if (!todaySummary && batchData.length > 0) {
        const todayActualUnits = batchData.reduce((sum, row) => sum + (row.actual_units || 0), 0);
        augmentedWeeklyData.push({ effective_date: todayStr, actual_units: todayActualUnits });
        console.log('Fallback: Added today\'s data from batch_data:', { effective_date: todayStr, actual_units: todayActualUnits });
      }

      // Format weekly data for the chart
      const weeklyDataFormatted = augmentedWeeklyData.map(item => {
        console.log('Raw effective_date from Supabase:', item.effective_date);

        // Normalize effective_date
        const effectiveDate = String(item.effective_date).split('T')[0].trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate)) {
          console.error('Invalid effective_date format:', effectiveDate);
          return null;
        }
        const dateParts = effectiveDate.split('-'); // e.g., ["2025", "05", "08"]
        const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 12); // Noon local time
        if (isNaN(date.getTime())) {
          console.error('Invalid date created from effective_date:', effectiveDate);
          return null;
        }
        return {
          effective_date: effectiveDate,
          day: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York' }),
          actual_units: Number(item.actual_units) || 0,
        };
      }).filter(item => item !== null);

      console.log('Weekly data formatted:', weeklyDataFormatted);

      // Ensure all 7 days are represented, even if no data
      const allDays = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = formatDateToYMD(date);
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York' });

        console.log('Looking for date:', dateStr);

        const dayData = weeklyDataFormatted.find(d => {
          const match = d.effective_date === dateStr;
          console.log('Comparing:', { formattedDate: d.effective_date, dateStr, match });
          return match;
        }) || {
          effective_date: dateStr,
          day: dayLabel,
          actual_units: 0,
        };
        allDays[i] = dayData;
      }
      allDays.reverse(); // Order from oldest to newest

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