'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import SummaryCard from '../components/SummaryCard';
import InsightsSection from '../components/InsightsSection';
import UpgradeToPremium from '../components/UpgradeToPremium';
import { Category, DailyExpense } from '../types';
import { generateAllInsights } from '@/lib/insights';
import { usePremium } from '@/hooks/usePremium';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { isPremium, isTrialActive, trialDaysLeft, loading: loadingPremium } = usePremium(user);
  const router = useRouter();
  const [salary, setSalary] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>([]);

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
      
      // Fetch daily expenses from Firestore
      fetchDailyExpenses();
    }
  }, [user]);

  const fetchDailyExpenses = async () => {
    if (!user) return;
    
    try {
      const expensesRef = collection(db, 'expenses');
      const q = query(expensesRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const fetchedExpenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DailyExpense[];
      
      setDailyExpenses(fetchedExpenses);
    } catch (error) {
      console.error('Error fetching daily expenses:', error);
    }
  };

  if (loading || loadingPremium || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  const totalSpent = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalDailySpent = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = salary - totalSpent - totalDailySpent;
  
  // Fix: Calculate percentage only if salary > 0, otherwise 0%
  const totalPercentage = salary > 0 
    ? categories.reduce((sum, cat) => sum + cat.percentage, 0)
    : 0;

  // Generate insights
  const insights = generateAllInsights(salary, categories, dailyExpenses);
  const hasAccess = isPremium || isTrialActive;

  return (
    <DashboardLayout
      userEmail={user.email}
      isPremium={isPremium}
      isTrialActive={isTrialActive}
      trialDaysLeft={trialDaysLeft}
    >
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Обзор</h1>
            <p className="text-sm sm:text-base text-gray-600">Добро пожаловать в ваш финансовый планировщик</p>
          </div>

          {/* Trial Warning */}
          {!isPremium && isTrialActive && trialDaysLeft <= 7 && (
            <div className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏰</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm sm:text-base">
                    Осталось {trialDaysLeft} {trialDaysLeft === 1 ? 'день' : trialDaysLeft < 5 ? 'дня' : 'дней'} пробного периода
                  </p>
                  <p className="text-xs sm:text-sm mt-1 opacity-90">
                    Обновитесь до Premium, чтобы не потерять доступ к аналитике и отчетам
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <SummaryCard
              title="Месячный доход"
              value={`${salary.toLocaleString('ru-RU')} ₽`}
              icon="�"
              color="blue"
            />
            <SummaryCard
              title="Потрачено"
              value={`${(totalSpent + totalDailySpent).toLocaleString('ru-RU')} ₽`}
              icon="💸"
              color="red"
            />
            <SummaryCard
              title="Остаток"
              value={`${remaining.toLocaleString('ru-RU')} ₽`}
              icon="💵"
              color={remaining >= 0 ? 'green' : 'red'}
              trend={remaining >= 0 ? 'up' : 'down'}
            />
            <SummaryCard
              title="Использовано"
              value={`${totalPercentage.toFixed(1)}%`}
              icon="📊"
              color={totalPercentage > 100 ? 'red' : 'green'}
            />
          </div>

          {/* Insights Section */}
          <div className="mb-6 sm:mb-8">
            {hasAccess ? (
              <InsightsSection insights={insights} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">💡 Финансовые рекомендации</h2>
                <div className="text-center py-6 sm:py-8">
                  <div className="text-5xl sm:text-6xl mb-4">🔒</div>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Персональные финансовые рекомендации доступны только для Premium пользователей
                  </p>
                  {user && <UpgradeToPremium userId={user.uid} userEmail={user.email || ''} />}
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Categories Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Категории расходов</h2>
              <div className="space-y-3">
                {categories.slice(0, 5).map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-gray-700 truncate">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">{cat.percentage.toFixed(1)}%</span>
                      <span className="text-xs sm:text-sm text-gray-600">{cat.amount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                ))}
                {categories.length > 5 && (
                  <p className="text-xs sm:text-sm text-gray-500 text-center pt-2">
                    +{categories.length - 5} еще...
                  </p>
                )}
              </div>
            </div>

            {/* Budget Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Статус бюджета</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm text-gray-600">Прогресс использования</span>
                    <span className={`text-xs sm:text-sm font-semibold ${totalPercentage > 100 ? 'text-red-600' : 'text-green-600'}`}>
                      {totalPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        totalPercentage > 100 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {totalPercentage > 100 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-red-700 font-medium">
                      ⚠️ Превышение бюджета на {(totalPercentage - 100).toFixed(1)}%
                    </p>
                  </div>
                )}

                {remaining < 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-red-700 font-medium">
                      ⚠️ Дефицит: {Math.abs(remaining).toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                )}

                {remaining >= 0 && totalPercentage <= 100 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-green-700 font-medium">
                      ✓ Бюджет в норме
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => router.push('/dashboard/planner')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors flex flex-col sm:flex-row items-center justify-center gap-2"
            >
              <span className="text-xl sm:text-base">💼</span>
              <span className="text-xs sm:text-base">Планировщик</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/daily')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors flex flex-col sm:flex-row items-center justify-center gap-2"
            >
              <span className="text-xl sm:text-base">📝</span>
              <span className="text-xs sm:text-base">Ежедневные</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/analytics')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors flex flex-col sm:flex-row items-center justify-center gap-2"
            >
              <span className="text-xl sm:text-base">📈</span>
              <span className="text-xs sm:text-base">Аналитика</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/goals')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors flex flex-col sm:flex-row items-center justify-center gap-2"
            >
              <span className="text-xl sm:text-base">🎯</span>
              <span className="text-xs sm:text-base">Цели</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
