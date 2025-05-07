export const calculateShiftScore = (data) => {
  const shifts = ['Morning', 'Afternoon', 'Evening'];
  return shifts
    .map((shift) => {
      const shiftData = data.filter((row) => row.shift === shift);
      const avgTargetPercentage =
        shiftData.length > 0
          ? shiftData.reduce((sum, row) => sum + row.target_percentage, 0) /
            shiftData.length
          : 0;
      const totalUnitDelta = shiftData.reduce(
        (sum, row) => sum + row.unit_delta,
        0
      );
      const score = avgTargetPercentage + totalUnitDelta / 10;
      return { shift, score };
    })
    .sort((a, b) => b.score - a.score);
};
