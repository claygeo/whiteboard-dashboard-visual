import React from 'react';

const ProductionTable = ({ data, currentShift, totals, language }) => {
  console.log('ProductionTable data prop:', data);
  console.log('ProductionTable totals prop:', totals);

  const labels = {
    Stations: 'Stations',
    Product: 'Product',
    BatchID: 'Batch ID',
    EmployeeCount: 'Employee Count',
    TotalLaborHours: 'Total Labor Hours',
    TargetUnits: 'Target Units',
    ActualUnits: 'Actual Units',
    TargetPercentage: 'Target %',
    UpLB: 'UpLH',
    UnitTarget: 'Unit Delta',
    Totals: 'Totals',
  };

  const tooltips = {
    Stations: 'Production line or station name',
    Product: 'Product name or identifier',
    BatchID: 'Unique batch identifier',
    EmployeeCount: 'Number of employees working on this batch',
    TotalLaborHours: 'Total labor hours spent on this batch',
    TargetUnits: 'Target number of units to produce',
    ActualUnits: 'Actual number of units produced',
    TargetPercentage: 'Actual units as a percentage of target units',
    UpLB: 'Units produced per labor hour',
    UnitTarget: 'Difference between actual and target units (negative in parentheses)',
    Totals: 'Summary totals for the day',
  };

  const currentLabels = labels;

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
  };

  // Dynamically adjust font sizes and padding based on the number of rows
  const rowCount = (data?.length || 0) + 2; // +2 for header and totals row
  const baseHeaderFontSize = 1.75;  // Reduced to 1.75rem
  const baseDataFontSize = 2.25;    // Increased to 2.25rem
  const basePadding = 0.75;         // 0.75rem

  // Adjust scaling to handle up to 32 rows (30 data rows + header + totals)
  const scaleFactor = Math.min(1, 35 / rowCount); // Adjusted to 35 to fit with larger data font size
  const headerFontSize = Math.max(1.5, baseHeaderFontSize * scaleFactor); // Minimum 1.5rem
  const dataFontSize = Math.max(1.75, baseDataFontSize * scaleFactor);    // Minimum 1.75rem
  const padding = Math.max(0.3, basePadding * scaleFactor);               // Minimum 0.3rem

  return (
    <div className="bg-gray-100">
      <div className="bg-white rounded-lg shadow-md mx-4">
        <table className="w-full">
          <colgroup>
            <col style={{ width: '8%' }} />  {/* Stations */}
            <col />                          {/* Product (auto width) */}
            <col />                          {/* Batch ID (auto width) */}
            <col style={{ width: '8%' }} />  {/* Employee Count (4 digits) */}
            <col style={{ width: '12%' }} /> {/* Total Labor Hours */}
            <col style={{ width: '8%' }} />  {/* Target Units (4 digits) */}
            <col style={{ width: '8%' }} />  {/* Actual Units (4 digits) */}
            <col style={{ width: '9%' }} />  {/* Target % */}
            <col style={{ width: '8%' }} />  {/* UpLH (4 digits) */}
            <col style={{ width: '8%' }} />  {/* Unit Delta (4 digits) */}
          </colgroup>
          <thead>
            <tr className="bg-gray-200">
              <th style={{ fontSize: `${headerFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-900 text-left whitespace-nowrap" title={tooltips.Stations} aria-label={currentLabels.Stations}>
                🏭 {currentLabels.Stations}
              </th>
              <th style={{ fontSize: `${headerFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-900 text-left whitespace-nowrap" title={tooltips.Product} aria-label={currentLabels.Product}>
                📦 {currentLabels.Product}
              </th>
              <th style={{ fontSize: `${headerFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-900 text-center whitespace-nowrap" title={tooltips.BatchID} aria-label={currentLabels.BatchID}>
                🔖 {currentLabels.BatchID}
              </th>
              <th style={{ fontSize: `${headerFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-900 text-center whitespace-normal break-words" title={tooltips.EmployeeCount} aria-label={currentLabels.EmployeeCount}>
                👥 {currentLabels.EmployeeCount}
              </th>
              <th style={{ fontSize: `${headerFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-900 text-center whitespace-normal break-words" title={tooltips.TotalLaborHours} aria-label={currentLabels.TotalLaborHours}>
                ⏰ {currentLabels.TotalLaborHours}
              </th>
              <th style={{ fontSize: `${headerFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-900 text-center whitespace-normal break-words" title={tooltips.TargetUnits} aria-label={currentLabels.TargetUnits}>
                🎯 {currentLabels.TargetUnits}
              </th>
              <th style={{ fontSize: `${headerFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-900 text-center whitespace-normal break-words" title={tooltips.ActualUnits} aria-label={currentLabels.ActualUnits}>
                ✅ {currentLabels.ActualUnits}
              </th>
              <th style={{ fontSize: `${headerFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-900 text-center whitespace-nowrap" title={tooltips.TargetPercentage} aria-label={currentLabels.TargetPercentage}>
                📈 {currentLabels.TargetPercentage}
              </th>
              <th style={{ fontSize: `${headerFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-900 text-center whitespace-nowrap" title={tooltips.UpLB} aria-label={currentLabels.UpLB}>
                ⚡ {currentLabels.UpLB}
              </th>
              <th style={{ fontSize: `${headerFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-900 text-center whitespace-normal break-words" title={tooltips.UnitTarget} aria-label={currentLabels.UnitTarget}>
                {currentLabels.UnitTarget}
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <tr key={row.id || index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-800 truncate">{row.line || 'N/A'}</td>
                  <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="text-gray-800 whitespace-nowrap">{row.product || 'N/A'}</td>
                  <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="text-gray-800 text-center whitespace-nowrap">{row.batch_number || '-'}</td>
                  <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-800 text-center truncate">{formatNumber(row.employee_count || 0)}</td>
                  <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-800 text-center truncate">
                    {row.total_labor_hours ? row.total_labor_hours.toFixed(1) : 0}
                  </td>
                  <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-800 text-center truncate">{formatNumber(row.target_units || 0)}</td>
                  <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-800 text-center truncate">{formatNumber(row.actual_units || 0)}</td>
                  <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className={`font-bold text-center truncate ${
                    row.target_percentage === 0 ? 'text-gray-800' : row.target_percentage > 98 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {Math.round(row.target_percentage || 0)}%
                  </td>
                  <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="font-bold text-gray-800 text-center truncate">{formatNumber(Math.round(row.uplh) || 0)}</td>
                  <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className={`font-bold text-center truncate ${
                    row.unit_delta === 0 ? 'text-gray-800' : row.unit_delta > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {row.unit_delta >= 0 ? formatNumber(row.unit_delta || 0) : `(${formatNumber(Math.abs(row.unit_delta) || 0)})`}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-600">
                  No data available for this shift
                </td>
              </tr>
            )}
            <tr className="bg-gray-300 font-bold">
              <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="text-gray-800 truncate">{currentLabels.Totals}</td>
              <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }}></td>
              <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }}></td>
              <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="text-gray-800 text-center truncate">{formatNumber(totals.employee_count || 0)}</td>
              <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="text-gray-800 text-center truncate">{totals.total_labor_hours?.toFixed(1) || 0}</td>
              <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="text-gray-800 text-center truncate">{formatNumber(totals.target_units || 0)}</td>
              <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="text-gray-800 text-center truncate">{formatNumber(totals.actual_units || 0)}</td>
              <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className={`text-center truncate ${
                totals.target_percentage === 0 ? 'text-gray-800' : totals.target_percentage > 98 ? 'text-green-500' : 'text-red-500'
              }`}>
                {Math.round(totals.target_percentage || 0)}%
              </td>
              <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className="text-gray-800 text-center truncate">{formatNumber(Math.round(totals.uplh) || 0)}</td>
              <td style={{ fontSize: `${dataFontSize}rem`, padding: `${padding}rem`, lineHeight: '1.1' }} className={`text-center truncate ${
                totals.unit_delta === 0 ? 'text-gray-800' : totals.unit_delta > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {totals.unit_delta >= 0 ? formatNumber(totals.unit_delta || 0) : `(${formatNumber(Math.abs(totals.unit_delta) || 0)})`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionTable;