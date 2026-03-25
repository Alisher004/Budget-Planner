'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { DailyExpense } from '../../types';

export default function DailyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<DailyExpense[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const savedExpenses = localStorage.getItem('dailyExpenses');
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && expenses.length > 0) {
      localStorage.setItem('dailyExpenses', JSON.stringify(expenses));
    }
  }, [expenses, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses.filter(exp => exp.date === today);
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = () => {
    if (!amount || !category) {
      alert('Пожалуйста, заполните сумму и категорию');
      return;
    }

    const newExpense: DailyExpense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      note,
      date: today,
      timestamp: Date.now(),
    };

    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setCategory('');
    setNote('');
    setShowForm(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const categoryOptions = [
    '🏠 Аренда',
    '🛒 Продукты',
    '🚗 Транспорт',
    '☕ Кафе',
    '🎬 Развлечения',
    '💊 Здоровье',
    '👕 Одежда',
    '📱 Связь',
    '🎓 Образование',
    '💰 Другое',
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userEmail={user.email} />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Ежедневные расходы</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              {showForm ? '✕ Закрыть' : '+ Добавить расход'}
            </button>
          </div>

          {/* Today's Summary */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-md p-6 mb-8 text-white">
            <h2 className="text-xl font-bold mb-2">Сегодня потрачено</h2>
            <p className="text-5xl font-bold">{todayTotal.toLocaleString('ru-RU')} ₽</p>
            <p className="text-sm mt-2 opacity-90">
              {todayExpenses.length} {todayExpenses.length === 1 ? 'расход' : 'расходов'}
            </p>
          </div>

          {/* Add Expense Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Новый расход</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Сумма *
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите категорию</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заметка (необязательно)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Например: Обед в кафе"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleAddExpense}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Добавить расход
              </button>
            </div>
          )}

          {/* Today's Expenses List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Расходы за сегодня</h2>
            
            {todayExpenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Сегодня расходов пока нет</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Добавить первый расход
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg">{expense.category.split(' ')[0]}</span>
                        <span className="font-semibold text-gray-900">{expense.category}</span>
                      </div>
                      {expense.note && (
                        <p className="text-sm text-gray-600">{expense.note}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(expense.timestamp).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-gray-900">
                        {expense.amount.toLocaleString('ru-RU')} ₽
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Expenses (Last 7 Days) */}
          {expenses.length > todayExpenses.length && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Предыдущие расходы</h2>
              <div className="space-y-3">
                {expenses
                  .filter(exp => exp.date !== today)
                  .slice(0, 10)
                  .map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-lg">{expense.category.split(' ')[0]}</span>
                          <span className="font-semibold text-gray-900">{expense.category}</span>
                        </div>
                        {expense.note && (
                          <p className="text-sm text-gray-600">{expense.note}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(expense.timestamp).toLocaleDateString('ru-RU')} в{' '}
                          {new Date(expense.timestamp).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-gray-900">
                          {expense.amount.toLocaleString('ru-RU')} ₽
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
