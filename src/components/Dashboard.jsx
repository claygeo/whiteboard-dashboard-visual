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

  // Monthly Goal data
  const lastMonthUnits = 15000; // Example: Actual units produced last month
  const thisMonthGoal = 18000; // Example: Goal for this month
  const currentUnits = totals.actual_units || 0; // Current actual units from totals
  const percentToGoal = thisMonthGoal > 0 ? ((thisMonthGoal - currentUnits) / thisMonthGoal) * 100 : 0;

  // Calculate trend for Monthly Goal note
  const trendPercentage = ((currentUnits - lastMonthUnits) / lastMonthUnits) * 100;
  const trendText = trendPercentage >= 0 ? `↑ ${trendPercentage.toFixed(1)}%` : `↓ ${Math.abs(trendPercentage).toFixed(1)}%`;
  const trendColor = trendPercentage >= 0 ? 'text-green-500' : 'text-red-500';

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

      {/* Buffer to add spacing below the table */}
      <div className="h-48"></div>

      {/* Flex Row for Logo, Chart, and Monthly Goal Note */}
      <div className="flex flex-col md:flex-row items-start justify-between w-full px-8 mb-6">
        {/* Curaleaf Logo - Moved back to middle left */}
        <div className="w-[480px] h-[480px] flex-shrink-0 mr-auto ml-24">
          <img
            src={curaleafLogo}
            alt="Curaleaf Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Weekly Chart (Center) */}
        <div className="flex-1 flex justify-center">
          <div className="max-w-[1600px]">
            <WeeklyChart weeklyData={weeklyData} />
          </div>
        </div>

        {/* Monthly Goal Note - Font size adjusted to 3x, kept on the right */}
        <div className="w-[480px] min-h-96 flex-shrink-0 ml-auto mr-24 bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-[60px] font-bold text-gray-900 mb-2">Monthly Goal</h4>
          <ul className="list-disc list-inside text-gray-800">
            <li className="text-[48px]">Last Month: {lastMonthUnits.toLocaleString()} units</li>
            <li className="text-[48px]">This Month Goal: {thisMonthGoal.toLocaleString()} units</li>
            <li className="text-[48px]">Current Units: {currentUnits.toLocaleString()} units</li>
            <li className="text-[48px]">Percent to Goal: {percentToGoal.toFixed(1)}% remaining</li>
            <li className={`text-[48px] ${trendColor}`}>Trend: {trendText}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;