import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onPercentageChange: (id: string, percentage: number) => void;
  onAmountChange: (id: string, amount: number) => void;
  onNameChange: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function CategoryCard({
  category,
  onPercentageChange,
  onAmountChange,
  onNameChange,
  onDelete,
}: CategoryCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <input
          type="text"
          className="text-base font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors flex-1 mr-2"
          value={category.name}
          onChange={(e) => onNameChange(category.id, e.target.value)}
        />
        <button
          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm transition-colors"
          onClick={() => onDelete(category.id)}
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-gray-600">Процент</label>
            <span className="text-sm font-bold text-blue-600">{category.percentage.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={category.percentage}
            onChange={(e) => onPercentageChange(category.id, Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Сумма</label>
          <div className="relative">
            <input
              type="number"
              value={category.amount.toFixed(0)}
              onChange={(e) => onAmountChange(category.id, Number(e.target.value))}
              min="0"
              step="100"
              className="w-full pl-3 pr-8 py-2 text-gray-900 font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₽</span>
          </div>
        </div>
      </div>
    </div>
  );
}
