import { useState, useEffect } from 'react';
import ProductionTable from './ProductionTable';
import WeeklyChart from './WeeklyChart';
import { useBatchData } from '../hooks/useBatchData';
import curaleafLogo from '../assets/curaleaf.png';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data, currentShift, totals, weeklyData, loading, error } = useBatchData();

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
      {/* Date, Time, Shift Header */}
      <div className="text-center text-gray-900 mb-4">
        <div className="text-5xl font-bold">{formattedDate}</div>
        <div className="text-4xl mt-2">{formattedTime}</div>
        <div className="text-3xl mt-2">Shift: {currentShift}</div>
      </div>

      {/* Production Table */}
      <div>
        <ProductionTable data={data} currentShift={currentShift} totals={totals} language="en" />
      </div>

      {/* Buffer with Curaleaf logo as background */}
      <div 
        className="h-48 w-full" 
        style={{ 
          backgroundImage: `url(${curaleafLogo})`, 
          backgroundSize: 'contain', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat', 
          opacity: 0.2 
        }}
      ></div>

      {/* Flex Row for Chart (Logo and Monthly Goal Removed) */}
      <div className="flex flex-col md:flex-row items-start justify-center w-full px-8 mb-6">
        {/* Weekly Chart (Center) */}
        <div className="flex-1 flex justify-center">
          <div className="max-w-[1600px]">
            <WeeklyChart weeklyData={weeklyData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;