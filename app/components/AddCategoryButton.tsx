interface AddCategoryButtonProps {
  onClick: () => void;
}

export default function AddCategoryButton({ onClick }: AddCategoryButtonProps) {
  return (
    <button 
      className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all" 
      onClick={onClick}
    >
      + Добавить категорию
    </button>
  );
}
