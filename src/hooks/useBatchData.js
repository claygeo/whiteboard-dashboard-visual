import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { calculateMetrics } from '../utils/calculateMetrics';

export const useBatchData = () => {
  const [data, setData] = useState([]);
  const [currentShift, setCurrentShift] = useState('');
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const determineCurrentShift = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'Morning';
    if (hour >= 14 && hour < 22) return 'Afternoon';
    return 'Evening';
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate today's date in EST/EDT (America/New_York timezone)
      const today = new Date().toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).split('/').map(num => num.padStart(2, '0')).join('-').replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2'); // Format as YYYY-MM-DD

      const shift = determineCurrentShift();
      setCurrentShift(shift);

      // Fetch all data for today, sorted by submission_time
      const { data: batchData, error } = await supabase
        .from('batch_data')
        .select('*, shift, submission_time, effective_date')
        .eq('effective_date', today)
        .order('submission_time', { ascending: false });

      if (error) throw error;

      // Process data
      const processedData = batchData.map((row) => ({
        ...row,
        ...calculateMetrics(row),
      }));

      setData(processedData);

      // Calculate totals for all rows, including average target_percentage and weighted average uplh
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

      // Calculate average target_percentage
      totals.target_percentage = totals.count > 0 ? totals.target_percentage_sum / totals.count : 0;
      // Calculate weighted average uplh
      totals.uplh = totals.total_labor_hours > 0 ? totals.actual_units / totals.total_labor_hours : 0;
      delete totals.target_percentage_sum;
      delete totals.count;

      setTotals(totals);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 60000); // Poll every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return { data, currentShift, totals, loading, error };
};