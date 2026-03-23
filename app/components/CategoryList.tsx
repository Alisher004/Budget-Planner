import { Category } from '../types';
import CategoryItem from './CategoryItem';

interface CategoryListProps {
  categories: Category[];
  onPercentageChange: (id: string, percentage: number) => void;
  onAmountChange: (id: string, amount: number) => void;
  onNameChange: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function CategoryList({
  categories,
  onPercentageChange,
  onAmountChange,
  onNameChange,
  onDelete,
}: CategoryListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-green-200 px-4 py-2">
        <h2 className="text-sm font-bold text-gray-800 uppercase">потребности</h2>
      </div>
      <div className="p-2 space-y-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onPercentageChange={onPercentageChange}
            onAmountChange={onAmountChange}
            onNameChange={onNameChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
