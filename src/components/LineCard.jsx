const LineCard = ({
  line,
  product,
  batch_number,
  employee_count,
  total_labor_hours,
  target_units,
  actual_units,
  target_percentage,
  uplb,
  unit_delta,
  language,
}) => {
  // Cap Target % at 200% for the progress circle
  const cappedTargetPercentage = Math.min(target_percentage, 200);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (cappedTargetPercentage / 200) * circumference;

  const labels = {
    en: {
      Product: 'Product',
      BatchID: 'Batch ID',
      EmployeeCount: 'Employee Count',
      TotalLaborHours: 'Total Labor Hours',
      TargetUnits: 'Target Units',
      ActualUnits: 'Actual Units',
      TargetPercentage: 'Target %',
      UpLB: 'UpLB',
      UnitTarget: 'Unit Target',
    },
    es: {
      Product: 'Producto',
      BatchID: 'ID de Lote',
      EmployeeCount: 'Conteo de Empleados',
      TotalLaborHours: 'Horas de Trabajo',
      TargetUnits: 'Unidades Objetivo',
      ActualUnits: 'Unidades Reales',
      TargetPercentage: 'Porcentaje Objetivo',
      UpLB: 'Unidades por Hora',
      UnitTarget: 'Diferencia Unidades',
    },
  };

  const currentLabels = labels[language];

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center space-x-4">
      <div className="relative">
        <svg className="w-16 h-16" viewBox="0 0 70 70">
          <circle
            className="text-gray-200"
            strokeWidth="5"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="35"
            cy="35"
          />
          <circle
            className={
              target_percentage > 100
                ? 'text-green-500'
                : target_percentage >= 80
                  ? 'text-yellow-500'
                  : 'text-red-500'
            }
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="35"
            cy="35"
          />
          <text
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle"
            className="text-lg font-semibold text-gray-700"
          >
            {Math.round(target_percentage)}%
          </text>
        </svg>
      </div>
      <div className="flex-1 grid grid-cols-4 gap-4">
        <div>
          <p className="text-xl font-semibold text-gray-700">
            📦 {currentLabels.Product}: {product || 'N/A'}
          </p>
          <p className="text-lg text-gray-600">
            🔖 {currentLabels.BatchID}: {batch_number || '-'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">
            👥 {currentLabels.EmployeeCount}: {employee_count || 0}
          </p>
          <p className="text-xl font-semibold text-gray-700">
            ⏰ {currentLabels.TotalLaborHours}:{' '}
            {total_labor_hours ? total_labor_hours.toFixed(1) : 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">
            ⚡ {currentLabels.UpLB}: {Math.round(uplb) || 0}
          </p>
          <p className="text-xl font-semibold text-gray-700">
            {unit_delta > 0 ? '➕' : unit_delta < 0 ? '➖' : '⚖️'}{' '}
            {currentLabels.UnitTarget}: {Math.abs(unit_delta) || 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">
            🎯 {currentLabels.TargetUnits}: {target_units || 0}
          </p>
          <p className="text-xl font-semibold text-gray-700">
            ✅ {currentLabels.ActualUnits}: {actual_units || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LineCard;
