export const calculateMetrics = (row) => {
  console.log('calculateMetrics input:', {
    total_time: row.total_time,
    employee_count: row.employee_count,
    actual_units: row.actual_units,
    target_units: row.target_units,
    target_delta: row.target_delta
  });

  // Convert total_time (in seconds) to hours
  const totalTimeHours = (row.total_time || 0) / 3600;

  // Calculate Total Labor Hours: total time (hours) * employee count
  const totalLaborHours = totalTimeHours * (row.employee_count || 0);

  // Calculate Target Percentage: (actual_units / target_units) * 100
  const targetPercentage = row.target_units > 0 ? (row.actual_units / row.target_units) * 100 : 0;

  // Calculate UpLH (Units per Labor Hour): actual_units / total_labor_hours
  const uplh = totalLaborHours > 0 ? (row.actual_units || 0) / totalLaborHours : 0;

  // Unit Delta (already provided as target_delta in the data)
  const unitDelta = row.target_delta || 0;

  const metrics = {
    total_labor_hours: totalLaborHours,
    target_percentage: targetPercentage,
    uplh: uplh,
    unit_delta: unitDelta,
  };

  console.log('calculateMetrics output:', metrics);
  return metrics;
};