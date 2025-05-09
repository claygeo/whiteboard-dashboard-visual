import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';

const WeeklyChart = ({ weeklyData }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[90vw] max-w-[2112px]">
        <h3 className="text-center text-[86px] font-bold text-gray-900 mb-6">Weekly Actual Production</h3>
        <BarChart
          width={2112}
          height={820}
          data={weeklyData}
          margin={{ top: 24, right: 48, left: 144, bottom: 72 }}
          className="w-full"
        >
          <XAxis dataKey="day" tick={{ fontSize: 48 }} />
          <YAxis 
            tick={{ fontSize: 43 }}
            tickCount={13} // Updated to 13 as previously confirmed
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
          >
            <LabelList 
              dataKey="actual_units" 
              position="top" 
              offset={10} 
              style={{ fontSize: 38, fill: '#1f2937' }}
              formatter={(value) => value.toLocaleString()}
            />
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default WeeklyChart;