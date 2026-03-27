'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/hooks/usePremium';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import PremiumGate from '../../components/PremiumGate';
import { Category } from '../../types';

export default function ReportsPage() {
  const { user, loading } = useAuth();
  const { isPremium, isTrialActive, trialDaysLeft, loading: loadingPremium } = usePremium(user);
  const router = useRouter();
  const [salary, setSalary] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('Март 2026');

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

  const handleExportCSV = () => {
    alert('Экспорт в CSV (функция в разработке)');
  };

  const handleExportPDF = () => {
    alert('Экспорт в PDF (функция в разработке)');
  };

  return (
    <PremiumGate isPremium={isPremium} isTrialActive={isTrialActive} trialDaysLeft={trialDaysLeft}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar userEmail={user.email} isPremium={isPremium} isTrialActive={isTrialActive} trialDaysLeft={trialDaysLeft} />
      
      <main className="flex-1 overflow-y-auto lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Отчеты</h1>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handleExportCSV}
                className="px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                📊 Экспорт CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                📄 Экспорт PDF
              </button>
            </div>
          </div>

          {/* Month Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Выберите месяц</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Март 2026</option>
              <option>Февраль 2026</option>
              <option>Январь 2026</option>
              <option>Декабрь 2025</option>
            </select>
          </div>

          {/* Summary Report */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Месячный отчет - {selectedMonth}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Общий доход</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{salary.toLocaleString('ru-RU')} с</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Всего потрачено</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600">{totalSpent.toLocaleString('ru-RU')} с</p>
              </div>
              <div className={`text-center p-3 sm:p-4 rounded-lg ${remaining >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Остаток</p>
                <p className={`text-2xl sm:text-3xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {remaining.toLocaleString('ru-RU')} с
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Использование бюджета</span>
                <span className={`text-sm font-bold ${totalPercentage > 100 ? 'text-red-600' : 'text-green-600'}`}>
                  {totalPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all ${totalPercentage > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Детализация по категориям</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Категория</th>
                    <th className="text-right py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Процент</th>
                    <th className="text-right py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Сумма</th>
                    <th className="text-right py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-xs sm:text-sm text-gray-900">{cat.name}</td>
                      <td className="py-3 px-4 text-xs sm:text-sm text-right font-semibold text-gray-900">
                        {cat.percentage.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-xs sm:text-sm text-right font-semibold text-gray-900">
                        {cat.amount.toLocaleString('ru-RU')} с
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          cat.percentage > 30 ? 'bg-red-100 text-red-700' :
                          cat.percentage > 15 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {cat.percentage > 30 ? 'Высокий' : cat.percentage > 15 ? 'Средний' : 'Низкий'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td className="py-3 px-4 text-xs sm:text-sm text-gray-900">ИТОГО</td>
                    <td className="py-3 px-4 text-xs sm:text-sm text-right text-gray-900">
                      {totalPercentage.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-xs sm:text-sm text-right text-gray-900">
                      {totalSpent.toLocaleString('ru-RU')} с
                    </td>
                    <td className="py-3 px-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
    </PremiumGate>
  );
}
