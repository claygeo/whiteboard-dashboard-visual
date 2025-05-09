import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const WeeklyChart = ({ weeklyData }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[90vw] max-w-[1760px]">
        <h3 className="text-center text-[86px] font-bold text-gray-900 mb-6">Weekly Actual Production</h3>
        <BarChart
          width={1920} // Increased width to accommodate y-axis label
          height={900} // Height unchanged
          data={weeklyData}
          margin={{ top: 20, right: 40, left: 140, bottom: 60 }} // Increased left margin
          className="w-full"
        >
          <XAxis dataKey="day" tick={{ fontSize: 60 }} />
          <YAxis 
            label={{ value: 'Actual Units', angle: -90, position: 'insideLeft', offset: -100, fontSize: 54 }} 
            tick={{ fontSize: 54 }}
          />
          <Tooltip 
            formatter={(value) => value.toLocaleString()} 
            contentStyle={{ fontSize: 21 }}
          />
          <Legend wrapperStyle={{ fontSize: 48 }} />
          <Bar
            dataKey="actual_units"
            name="Actual Units"
            fill="#3b82f6" // Blue
          />
        </BarChart>
      </div>
    </div>
  );
};

export default WeeklyChart;