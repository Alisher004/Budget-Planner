interface SalaryInputProps {
  salary: number;
  onChange: (salary: number) => void;
}

export default function SalaryInput({ salary, onChange }: SalaryInputProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-orange-400 px-4 py-2">
        <h2 className="text-sm font-bold text-gray-800 uppercase">ваш бюджет</h2>
      </div>
      <div className="p-4">
        <input
          id="salary"
          type="number"
          value={salary || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          min="0"
          className="w-full text-center text-4xl font-bold text-gray-900 bg-transparent border-b-4 border-blue-500 focus:outline-none focus:border-blue-600 pb-2"
        />
        <div className="text-center text-3xl font-bold text-gray-900 mt-1">Сом</div>
      </div>
    </div>
  );
}
