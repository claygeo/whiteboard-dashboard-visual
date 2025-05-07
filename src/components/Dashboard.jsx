import { useState, useEffect } from 'react';
import ProductionTable from './ProductionTable';
import { useBatchData } from '../hooks/useBatchData';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data, currentShift, totals, loading, error } = useBatchData();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center p-4 text-2xl">Loading...</div>;
  if (error) return (
    <div className="text-center p-4 text-red-600 text-2xl">
      Error loading data: {error.message}. Please check your connection or contact IT.
    </div>
  );

  // Format date as "May 5, 2025"
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  });

  // Format time as "10:30:45 AM EST"
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZone: 'America/New_York',
  }) + ' EST';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="text-center text-gray-900 mb-4">
        <div className="text-5xl font-bold">{formattedDate}</div>
        <div className="text-4xl mt-2">{formattedTime}</div>
      </div>
      <div className="flex-1">
        <ProductionTable data={data} currentShift={currentShift} totals={totals} language="en" />
      </div>
    </div>
  );
};

export default Dashboard;