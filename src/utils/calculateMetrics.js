export const calculateMetrics = (row) => ({
  total_labor_hours: row.total_time / 3600,
  target_percentage:
    row.target_units > 0 ? (row.actual_units / row.target_units) * 100 : 0,
  uplb: row.total_time > 0 ? row.actual_units / (row.total_time / 3600) : 0,
  unit_delta: row.target_delta,
});
