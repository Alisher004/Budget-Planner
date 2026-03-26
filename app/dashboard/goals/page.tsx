'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/hooks/usePremium';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Category } from '../../types';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

export default function GoalsPage() {
  const { user, loading } = useAuth();
  const { isPremium, isTrialActive, trialDaysLeft, loading: loadingPremium } = usePremium(user);
  const router = useRouter();
  const [salary, setSalary] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', name: '💰 Накопления на отпуск', target: 100000, current: 0, deadline: '2026-08-01' },
    { id: '2', name: '🏠 Первоначальный взнос', target: 500000, current: 0, deadline: '2027-01-01' },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const savedSalary = localStorage.getItem('salary');
      const savedCategories = localStorage.getItem('categories');
      const savedGoals = localStorage.getItem('goals');
      
      if (savedSalary) setSalary(Number(savedSalary));
      if (savedCategories) setCategories(JSON.parse(savedCategories));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('goals', JSON.stringify(goals));
    }
  }, [goals, user]);

  // Calculate savings from remaining budget
  useEffect(() => {
    const totalSpent = categories.reduce((sum, cat) => sum + cat.amount, 0);
    const remaining = salary - totalSpent;
    
    if (remaining > 0 && goals.length > 0) {
      setGoals(prevGoals => 
        prevGoals.map((goal, index) => 
          index === 0 ? { ...goal, current: Math.min(goal.current + remaining, goal.target) } : goal
        )
      );
    }
  }, [salary, categories]);

  if (loading || loadingPremium || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  const totalSpent = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const remaining = salary - totalSpent;

  const handleAddGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: '🎯 Новая цель',
      target: 50000,
      current: 0,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setGoals([...goals, newGoal]);
  };

  const handleUpdateGoal = (id: string, field: keyof Goal, value: string | number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Финансовые цели</h1>
            <button
              onClick={handleAddGoal}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              + Добавить цель
            </button>
          </div>

          {/* Savings Info */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md p-6 mb-8 text-white">
            <h2 className="text-xl font-bold mb-2">Доступно для накоплений</h2>
            <p className="text-4xl font-bold">{remaining.toLocaleString('ru-RU')} ₽</p>
            <p className="text-sm mt-2 opacity-90">
              {remaining > 0 ? 'Отличная работа! У вас есть средства для достижения целей.' : 'Оптимизируйте расходы для накоплений.'}
            </p>
          </div>

          {/* Goals List */}
          <div className="space-y-6">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={goal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <input
                      type="text"
                      value={goal.name}
                      onChange={(e) => handleUpdateGoal(goal.id, 'name', e.target.value)}
                      className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none flex-1 mr-4"
                    />
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Целевая сумма</label>
                      <input
                        type="number"
                        value={goal.target}
                        onChange={(e) => handleUpdateGoal(goal.id, 'target', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Текущая сумма</label>
                      <input
                        type="number"
                        value={goal.current}
                        onChange={(e) => handleUpdateGoal(goal.id, 'current', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Срок достижения</label>
                      <input
                        type="date"
                        value={goal.deadline}
                        onChange={(e) => handleUpdateGoal(goal.id, 'deadline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Прогресс</span>
                      <span className="text-sm font-bold text-blue-600">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          progress >= 100 ? 'bg-green-500' : progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {goal.current.toLocaleString('ru-RU')} ₽ из {goal.target.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className={daysLeft > 0 ? 'text-gray-600' : 'text-red-600'}>
                      {daysLeft > 0 ? `${daysLeft} дней осталось` : 'Срок истек'}
                    </span>
                  </div>

                  {progress >= 100 && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700 font-medium">
                        🎉 Поздравляем! Цель достигнута!
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {goals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">У вас пока нет финансовых целей</p>
              <button
                onClick={handleAddGoal}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Создать первую цель
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
