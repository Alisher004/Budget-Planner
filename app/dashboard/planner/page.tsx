'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/hooks/usePremium';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import CategoryCard from '../../components/CategoryCard';
import { Category } from '../../types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '🏠 Аренда', percentage: 35, amount: 0 },
  { id: '2', name: '🛒 Продукты', percentage: 15, amount: 0 },
  { id: '3', name: '⚡ Коммун услуги', percentage: 5, amount: 0 },
  { id: '4', name: '📞 Связь', percentage: 3, amount: 0 },
  { id: '5', name: '🚗 Транспорт', percentage: 5, amount: 0 },
  { id: '6', name: '🧼 Гигиена', percentage: 3, amount: 0 },
  { id: '7', name: '💊 Лекарства', percentage: 7, amount: 0 },
];

export default function PlannerPage() {
  const { user, loading } = useAuth();
  const { isPremium, isTrialActive, trialDaysLeft, loading: loadingPremium } = usePremium(user);
  const router = useRouter();
  const [salary, setSalary] = useState(0);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const savedSalary = localStorage.getItem('salary');
      const savedCategories = localStorage.getItem('categories');
      
      if (savedSalary) setSalary(Number(savedSalary));
      if (savedCategories) setCategories(JSON.parse(savedCategories));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('salary', salary.toString());
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [salary, categories, user]);

  const handleSalaryChange = (newSalary: number) => {
    setSalary(newSalary);
    setCategories(cats => 
      cats.map(cat => ({
        ...cat,
        amount: (newSalary * cat.percentage) / 100
      }))
    );
  };

  const handlePercentageChange = (id: string, percentage: number) => {
    setCategories(cats =>
      cats.map(cat =>
        cat.id === id
          ? { ...cat, percentage, amount: (salary * percentage) / 100 }
          : cat
      )
    );
  };

  const handleAmountChange = (id: string, amount: number) => {
    setCategories(cats =>
      cats.map(cat =>
        cat.id === id
          ? { ...cat, amount, percentage: salary > 0 ? (amount / salary) * 100 : 0 }
          : cat
      )
    );
  };

  const handleNameChange = (id: string, name: string) => {
    setCategories(cats =>
      cats.map(cat => (cat.id === id ? { ...cat, name } : cat))
    );
  };

  const handleDelete = (id: string) => {
    setCategories(cats => cats.filter(cat => cat.id !== id));
  };

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: '📝 Новая категория',
      percentage: 0,
      amount: 0,
    };
    setCategories([...categories, newCategory]);
  };

  if (loading || loadingPremium || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  const totalSpent = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const remaining = salary - totalSpent;
  const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);
  const isOverBudget = totalPercentage > 100;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        userEmail={user.email} 
        isPremium={isPremium}
        isTrialActive={isTrialActive}
        trialDaysLeft={trialDaysLeft}
      />
      
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Планировщик бюджета</h1>

          {/* Salary Input */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="bg-orange-400 px-6 py-3 rounded-t-lg">
              <h2 className="text-sm font-bold text-gray-800 uppercase">Ваш бюджет</h2>
            </div>
            <div className="p-6">
              <input
                type="number"
                value={salary || ''}
                onChange={(e) => handleSalaryChange(Number(e.target.value))}
                placeholder="Ваш бюджет"
                min="0"
                className="w-full text-center text-4xl font-bold text-gray-900 bg-transparent border-b-4 border-blue-500 focus:outline-none focus:border-blue-600 pb-2"
              />
              <div className="text-center text-3xl font-bold text-gray-900 mt-1">₽</div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Потрачено</p>
                <p className="text-2xl font-bold text-gray-900">{totalSpent.toLocaleString('ru-RU')} ₽</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Использовано</p>
                <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  {totalPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Остаток</p>
                <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {remaining.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverBudget ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(totalPercentage, 100)}%` }}
              />
            </div>

            {isOverBudget && (
              <p className="text-sm text-red-600 font-medium mt-2 text-center">
                ⚠️ Бюджет превышает 100%
              </p>
            )}
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Категории расходов</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onPercentageChange={handlePercentageChange}
                  onAmountChange={handleAmountChange}
                  onNameChange={handleNameChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>

          {/* Add Category Button */}
          <button
            onClick={handleAddCategory}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            + Добавить категорию
          </button>
        </div>
      </main>
    </div>
  );
}