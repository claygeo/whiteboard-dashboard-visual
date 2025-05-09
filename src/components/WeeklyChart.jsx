import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const WeeklyChart = ({ weeklyData }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[90vw] max-w-[1600px]">
        <h3 className="text-center text-7xl font-bold text-gray-900 mb-6">Weekly Actual Production</h3>
        <BarChart
          width={1600} // Base width, constrained by parent div
          height={600} // Height unchanged
          data={weeklyData}
          margin={{ top: 20, right: 40, left: 80, bottom: 30 }} // Increased left margin for label space
          className="w-full"
        >
          <XAxis dataKey="day" tick={{ fontSize: 40 }} />
          <YAxis 
            label={{ value: 'Actual Units', angle: -90, position: 'insideLeft', offset: -60, fontSize: 36 }} 
            tick={{ fontSize: 36 }}
          />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend wrapperStyle={{ fontSize: 32 }} />
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