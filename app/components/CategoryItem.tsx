import { Category } from '../types';

interface CategoryItemProps {
  category: Category;
  onPercentageChange: (id: string, percentage: number) => void;
  onAmountChange: (id: string, amount: number) => void;
  onNameChange: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function CategoryItem({
  category,
  onPercentageChange,
  onAmountChange,
  onNameChange,
  onDelete,
}: CategoryItemProps) {
  return (
    <div className="bg-green-100 rounded-lg p-3 flex items-center justify-between group hover:bg-green-200 transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <input
          type="text"
          className="text-base font-medium text-gray-900 bg-transparent focus:outline-none focus:bg-white focus:px-2 focus:py-1 focus:rounded transition-all flex-1 min-w-0"
          value={category.name}
          onChange={(e) => onNameChange(category.id, e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={category.percentage.toFixed(0)}
          onChange={(e) => onPercentageChange(category.id, Number(e.target.value))}
          min="0"
          max="100"
          className="w-12 text-center text-sm font-semibold text-gray-900 bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1 py-1"
        />
        <span className="text-sm font-semibold text-gray-900">%</span>
        
        <input
          type="number"
          value={category.amount.toFixed(0)}
          onChange={(e) => onAmountChange(category.id, Number(e.target.value))}
          min="0"
          step="1000"
          className="w-24 text-right text-base font-bold text-gray-900 bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1"
        />
        <span className="text-base font-bold text-gray-900">₽</span>
        
        <button
          className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 text-xs font-medium transition-opacity ml-2"
          onClick={() => onDelete(category.id)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
