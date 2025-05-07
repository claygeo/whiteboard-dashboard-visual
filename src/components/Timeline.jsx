const Timeline = ({ data, currentShift, language }) => {
  const timelineData = [];

  // Get unique dates in the week
  const dates = [...new Set(data.map((row) => row.effective_date))].sort();

  // For each date, calculate average Target % for the current shift
  dates.forEach((date) => {
    const dayData = {
      day: new Date(date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { weekday: 'short' }),
      targetPercentage: 0,
    };
    const shiftData = data.filter(
      (row) => row.effective_date === date && row.shift === currentShift
    );
    const avgTargetPercentage =
      shiftData.length > 0
        ? shiftData.reduce((sum, row) => sum + row.target_percentage, 0) /
          shiftData.length
        : 0;
    dayData.targetPercentage = Math.round(avgTargetPercentage);
    timelineData.push(dayData);
  });

  const title = language === 'en' ? '📅 Weekly Goal %' : '📅 Porcentaje Objetivo Semanal';

  // SVG dimensions
  const width = 1200;
  const height = 150;
  const padding = 30;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Scale data
  const maxTarget = Math.max(...timelineData.map(d => d.targetPercentage), 100);
  const xScale = chartWidth / (timelineData.length - 1 || 1);
  const yScale = chartHeight / maxTarget;

  // Generate points for the line
  const points = timelineData
    .map((d, i) => {
      const x = padding + i * xScale;
      const y = height - padding - d.targetPercentage * yScale;
      return `${x},${y}`;
    })
    .join(' ');

  // Generate labels
  const xLabels = timelineData.map((d, i) => {
    const x = padding + i * xScale;
    return (
      <text
        key={d.day}
        x={x}
        y={height - padding + 20}
        textAnchor="middle"
        className="text-lg text-gray-700"
      >
        {d.day}
      </text>
    );
  });

  const yLabels = [0, Math.round(maxTarget / 2), Math.round(maxTarget)].map((val, i) => {
    const y = height - padding - val * yScale;
    return (
      <text
        key={val}
        x={padding - 20}
        y={y + 5}
        textAnchor="end"
        className="text-lg text-gray-700"
      >
        {val}
      </text>
    );
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-center text-gray-800">
        {title}
      </h3>
      <svg width={width} height={height}>
        {/* X and Y axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#ccc"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#ccc"
          strokeWidth="2"
        />
        {/* Line */}
        {timelineData.length > 1 && (
          <polyline
            points={points}
            fill="none"
            stroke={
              currentShift === 'Morning'
                ? '#FFD700'
                : currentShift === 'Afternoon'
                ? '#87CEEB'
                : '#800080'
            }
            strokeWidth="3"
          />
        )}
        {/* Data points */}
        {timelineData.map((d, i) => {
          const x = padding + i * xScale;
          const y = height - padding - d.targetPercentage * yScale;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="5"
              fill={
                currentShift === 'Morning'
                  ? '#FFD700'
                  : currentShift === 'Afternoon'
                  ? '#87CEEB'
                  : '#800080'
              }
            />
          );
        })}
        {/* Labels */}
        {xLabels}
        {yLabels}
      </svg>
    </div>
  );
};

export default Timeline;