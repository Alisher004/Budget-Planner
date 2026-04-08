'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/hooks/usePremium';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import PremiumGate from '../../components/PremiumGate';
import { Category, DailyExpense } from '../../types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';

export default function ReportsPage() {
  const { user, loading } = useAuth();
  const { isPremium, isTrialActive, trialDaysLeft, loading: loadingPremium } = usePremium(user);
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslations(language);
  
  const [salary, setSalary] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(true);

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
      
      fetchDailyExpenses();
    }
  }, [user]);

  const fetchDailyExpenses = async () => {
    if (!user) return;
    
    try {
      setLoadingData(true);
      const expensesRef = collection(db, 'expenses');
      const q = query(expensesRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const fetchedExpenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DailyExpense[];
      
      setDailyExpenses(fetchedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingPremium || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  // Filter expenses by selected month and category
  const filteredExpenses = dailyExpenses.filter(exp => {
    const expDate = new Date(exp.date);
    const matchesMonth = expDate.getMonth() === selectedMonth && expDate.getFullYear() === selectedYear;
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    return matchesMonth && matchesCategory;
  });

  // Get unique categories from expenses
  const expenseCategories = Array.from(new Set(dailyExpenses.map(exp => exp.category)));

  // Group expenses by day
  const expensesByDay: { [key: string]: DailyExpense[] } = {};
  filteredExpenses.forEach(exp => {
    if (!expensesByDay[exp.date]) {
      expensesByDay[exp.date] = [];
    }
    expensesByDay[exp.date].push(exp);
  });

  // Sort days in descending order
  const sortedDays = Object.keys(expensesByDay).sort((a, b) => b.localeCompare(a));

  // Calculate previous month spending for comparison
  const prevMonthDate = new Date(selectedYear, selectedMonth - 1);
  const prevMonthExpenses = dailyExpenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === prevMonthDate.getMonth() && 
           expDate.getFullYear() === prevMonthDate.getFullYear();
  });
  const prevMonthSpent = prevMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const totalDailySpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budgetUsagePercent = salary > 0 ? (totalDailySpent / salary) * 100 : 0;
  
  // Determine status
  let statusColor = 'green';
  let statusText = 'Отлично';
  let statusMessage = 'Вы контролируете расходы хорошо';
  
  if (budgetUsagePercent > 80) {
    statusColor = 'red';
    statusText = 'Высокие расходы';
    statusMessage = 'Вы потратили больше обычного';
  } else if (budgetUsagePercent > 50) {
    statusColor = 'yellow';
    statusText = 'Средние расходы';
    statusMessage = 'Расходы в пределах нормы';
  }

  // Compare with previous month
  if (prevMonthSpent > 0) {
    const difference = totalDailySpent - prevMonthSpent;
    const percentChange = (difference / prevMonthSpent) * 100;
    
    if (Math.abs(percentChange) > 20) {
      if (difference > 0) {
        statusMessage = `Расходы выше на ${Math.abs(percentChange).toFixed(0)}% чем в прошлом месяце`;
      } else {
        statusMessage = `Расходы ниже на ${Math.abs(percentChange).toFixed(0)}% чем в прошлом месяце`;
      }
    }
  }

  const months = [
    t('january'), t('february'), t('march'), t('april'),
    t('may'), t('june'), t('july'), t('august'),
    t('september'), t('october'), t('november'), t('december')
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const toggleDay = (date: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  };

  const handleExportCSV = () => {
    const csvData = [
      ['Дата', 'Категория', 'Сумма', 'Заметка'],
      ...filteredExpenses.map(exp => [
        new Date(exp.date).toLocaleDateString('ru-RU'),
        exp.category,
        exp.amount,
        exp.note || ''
      ]),
      ['', 'ИТОГО', totalDailySpent, ''],
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report_${selectedYear}_${selectedMonth + 1}.csv`;
    link.click();
  };

  return (
    <PremiumGate isPremium={isPremium} isTrialActive={isTrialActive} trialDaysLeft={trialDaysLeft}>
      <div className="flex min-h-screen bg-gray-50 overflow-hidden">
        <Sidebar userEmail={user.email} isPremium={isPremium} isTrialActive={isTrialActive} trialDaysLeft={trialDaysLeft} />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8 w-full max-w-full">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('reports')}</h1>
            <button
              onClick={handleExportCSV}
              className="px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              📊 {t('exportCSV')}
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 sm:mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Фильтры</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  {t('selectMonth')}
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  {t('selectYear')}
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все категории</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Monthly Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Статус за {months[selectedMonth]} {selectedYear}
              {selectedCategory !== 'all' && ` - ${selectedCategory}`}
            </h2>
            
            {/* Main Status Card */}
            <div className={`p-6 rounded-lg mb-4 ${
              statusColor === 'green' ? 'bg-green-50 border-2 border-green-200' :
              statusColor === 'yellow' ? 'bg-yellow-50 border-2 border-yellow-200' :
              'bg-red-50 border-2 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Общие расходы</p>
                  <p className={`text-4xl font-bold ${
                    statusColor === 'green' ? 'text-green-600' :
                    statusColor === 'yellow' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {totalDailySpent.toLocaleString('ru-RU')} с
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{filteredExpenses.length} транзакций</p>
                </div>
                <div className={`text-6xl ${
                  statusColor === 'green' ? 'text-green-500' :
                  statusColor === 'yellow' ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {statusColor === 'green' ? '✓' : statusColor === 'yellow' ? '⚠' : '⚠'}
                </div>
              </div>
              
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-3 ${
                statusColor === 'green' ? 'bg-green-100 text-green-800' :
                statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {statusText}
              </div>
              
              <p className="text-gray-700 font-medium">{statusMessage}</p>
            </div>

            {/* Budget Usage */}
            {salary > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Использование бюджета</span>
                  <span className={`text-sm font-bold ${
                    budgetUsagePercent > 80 ? 'text-red-600' :
                    budgetUsagePercent > 50 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {budgetUsagePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      budgetUsagePercent > 80 ? 'bg-red-500' :
                      budgetUsagePercent > 50 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Бюджет: {salary.toLocaleString('ru-RU')} с
                </p>
              </div>
            )}
          </div>

          {/* Daily Breakdown */}
          {sortedDays.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Расходы по дням
              </h2>
              <div className="space-y-2">
                {sortedDays.map((date) => {
                  const dayExpenses = expensesByDay[date];
                  const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                  const isExpanded = expandedDays.has(date);
                  
                  return (
                    <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleDay(date)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{isExpanded ? '▼' : '▶'}</span>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">
                              {new Date(date).toLocaleDateString('ru-RU', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </p>
                            <p className="text-sm text-gray-600">{dayExpenses.length} расходов</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            {dayTotal.toLocaleString('ru-RU')} с
                          </p>
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="border-t border-gray-200 bg-white">
                          {dayExpenses.map((exp) => (
                            <div key={exp.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{exp.category.split(' ')[0]}</span>
                                    <p className="font-medium text-gray-900">{exp.category}</p>
                                  </div>
                                  {exp.note && (
                                    <p className="text-sm text-gray-600 mt-1">{exp.note}</p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(exp.timestamp).toLocaleTimeString('ru-RU', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-lg font-bold text-gray-900">
                                    {exp.amount.toLocaleString('ru-RU')} с
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                {loadingData ? 'Загрузка...' : 'Нет расходов за выбранный период'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
    </PremiumGate>
  );
}
