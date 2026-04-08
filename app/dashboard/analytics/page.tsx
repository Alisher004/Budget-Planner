'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/hooks/usePremium';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import PremiumGate from '../../components/PremiumGate';
import { Category, DailyExpense } from '../../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function AnalyticsPage() {
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

  const totalPlanned = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalDailySpent = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = salary - totalPlanned - totalDailySpent;

  // Prepare data for pie chart (planned budget)
  const pieData = categories
    .filter(cat => cat.amount > 0)
    .map(cat => ({
      name: cat.name,
      value: cat.amount,
    }));

  // Prepare data for daily expenses pie chart
  const dailyByCategory: { [key: string]: number } = {};
  dailyExpenses.forEach(exp => {
    dailyByCategory[exp.category] = (dailyByCategory[exp.category] || 0) + exp.amount;
  });

  const dailyPieData = Object.entries(dailyByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  // Prepare data for bar chart (mock monthly data)
  const barData = [
    { month: 'Янв', planned: totalPlanned * 0.9, daily: totalDailySpent * 0.8, remaining: salary - totalPlanned * 0.9 - totalDailySpent * 0.8 },
    { month: 'Фев', planned: totalPlanned * 0.95, daily: totalDailySpent * 0.9, remaining: salary - totalPlanned * 0.95 - totalDailySpent * 0.9 },
    { month: 'Мар', planned: totalPlanned, daily: totalDailySpent, remaining: remaining },
  ];

  return (
    <PremiumGate isPremium={isPremium} isTrialActive={isTrialActive} trialDaysLeft={trialDaysLeft}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar userEmail={user.email} isPremium={isPremium} isTrialActive={isTrialActive} trialDaysLeft={trialDaysLeft} />
      
      <main className="flex-1 overflow-y-auto lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Аналитика</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Общий доход</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{salary.toLocaleString('ru-RU')} с</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Запланировано</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">{totalPlanned.toLocaleString('ru-RU')} с</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Ежедневные расходы</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">{totalDailySpent.toLocaleString('ru-RU')} с</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Остаток</p>
              <p className={`text-2xl sm:text-3xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {remaining.toLocaleString('ru-RU')} с
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Planned Budget Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Планируемый бюджет</h2>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toLocaleString('ru-RU')} с`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-20">Нет данных для отображения</p>
              )}
            </div>

            {/* Daily Expenses Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Ежедневные расходы</h2>
              {dailyPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dailyPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dailyPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toLocaleString('ru-RU')} с`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-20">Нет данных для отображения</p>
              )}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Динамика по месяцам</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toLocaleString('ru-RU')} с`} />
                <Legend />
                <Bar dataKey="planned" fill="#8B5CF6" name="Запланировано" />
                <Bar dataKey="daily" fill="#F97316" name="Ежедневные" />
                <Bar dataKey="remaining" fill="#10B981" name="Остаток" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Планируемые категории</h2>
              <div className="space-y-3">
                {categories.map((cat, index) => (
                  <div key={cat.id} className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{cat.amount.toLocaleString('ru-RU')} с</p>
                      <p className="text-xs text-gray-500">{cat.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Ежедневные расходы</h2>
              <div className="space-y-3">
                {Object.entries(dailyByCategory).map(([category, amount], index) => (
                  <div key={category} className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{amount.toLocaleString('ru-RU')} с</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </PremiumGate>
  );
}
