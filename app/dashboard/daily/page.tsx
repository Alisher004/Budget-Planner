'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/hooks/usePremium';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { DailyExpense } from '../../types';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { useToast } from '@/hooks/useToast';
import Toast from '../../components/Toast';

export default function DailyPage() {
  const { user, loading } = useAuth();
  const { isPremium, isTrialActive, trialDaysLeft, loading: loadingPremium } = usePremium(user);
  const router = useRouter();
  const [expenses, setExpenses] = useState<DailyExpense[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toasts, showToast, hideToast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch expenses from Firestore
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    if (!user) return;
    
    try {
      setLoadingExpenses(true);
      const expensesRef = collection(db, 'expenses');
      const q = query(
        expensesRef,
        where('userId', '==', user.uid)
      );
      
      const snapshot = await getDocs(q);
      const fetchedExpenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DailyExpense[];
      
      // Sort in memory instead of Firestore
      fetchedExpenses.sort((a, b) => b.timestamp - a.timestamp);
      
      setExpenses(fetchedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      showToast('Ошибка загрузки расходов', 'error');
    } finally {
      setLoadingExpenses(false);
    }
  };

  if (loading || loadingPremium || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses.filter(exp => exp.date === today);
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = async () => {
    if (!amount || !category) {
      showToast('Пожалуйста, заполните сумму и категорию', 'error');
      return;
    }

    if (!user) return;

    try {
      setSaving(true);
      const expensesRef = collection(db, 'expenses');
      const newExpense = {
        userId: user.uid,
        amount: parseFloat(amount),
        category,
        note,
        date: today,
        timestamp: Date.now(),
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(expensesRef, newExpense);
      
      // Add to local state
      setExpenses([{ id: docRef.id, ...newExpense } as DailyExpense, ...expenses]);
      
      setAmount('');
      setCategory('');
      setNote('');
      setShowForm(false);
      showToast('Расход добавлен', 'success');
    } catch (error) {
      console.error('Error adding expense:', error);
      showToast('Ошибка при добавлении расхода', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Удалить этот расход?')) return;

    try {
      await deleteDoc(doc(db, 'expenses', id));
      setExpenses(expenses.filter(exp => exp.id !== id));
      showToast('Расход удален', 'success');
    } catch (error) {
      console.error('Error deleting expense:', error);
      showToast('Ошибка при удалении расхода', 'error');
    }
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
      <Sidebar 
        userEmail={user.email}
        isPremium={isPremium}
        isTrialActive={isTrialActive}
        trialDaysLeft={trialDaysLeft}
      />
      
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
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
                    disabled={saving}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={saving}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
                  disabled={saving}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <button
                onClick={handleAddExpense}
                disabled={saving}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Сохранение...' : 'Добавить расход'}
              </button>
            </div>
          )}

          {/* Today's Expenses List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Расходы за сегодня</h2>
            
            {loadingExpenses ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Загрузка...</p>
              </div>
            ) : todayExpenses.length === 0 ? (
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
      
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
}
