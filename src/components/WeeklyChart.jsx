import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const WeeklyChart = ({ weeklyData }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[90vw] max-w-[2112px]">
        <h3 className="text-center text-[86px] font-bold text-gray-900 mb-6">Weekly Actual Production</h3>
        <BarChart
          width={2112} // Increased width (20% larger + 10% stretch)
          height={720} // Increased height (20% larger)
          data={weeklyData}
          margin={{ top: 24, right: 48, left: 144, bottom: 72 }} // Increased margins (20% larger)
          className="w-full"
        >
          <XAxis dataKey="day" tick={{ fontSize: 48 }} />
          <YAxis 
            label={{ value: 'Actual Units', angle: -90, position: 'insideLeft', offset: -120, fontSize: 43 }} 
            tick={{ fontSize: 43 }}
          />
          <Tooltip 
            formatter={(value) => value.toLocaleString()} 
            contentStyle={{ fontSize: 17 }}
          />
          <Legend wrapperStyle={{ fontSize: 38 }} />
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