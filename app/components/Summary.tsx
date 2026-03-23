import { Category } from '../types';

interface SummaryProps {
  salary: number;
  categories: Category[];
}

export default function Summary({ salary, categories }: SummaryProps) {
  const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);
  const usedAmount = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const remaining = salary - usedAmount;
  const isOverBudget = totalPercentage > 100;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-300 px-4 py-2">
        <h2 className="text-sm font-bold text-gray-800 uppercase">итого</h2>
      </div>
      <div className="bg-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-base font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
            {totalPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {usedAmount.toFixed(0)} ₽
          </div>
        </div>
      </div>
      {isOverBudget && (
        <div className="bg-red-100 px-4 py-2">
          <p className="text-xs text-red-700 font-medium">⚠️ Бюджет превышает 100%</p>
        </div>
      )}
    </div>
  );
}
