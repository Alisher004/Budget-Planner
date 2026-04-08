'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/hooks/usePremium';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { MonthlyPlan } from '../../types';
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore';
import { useToast } from '@/hooks/useToast';
import Toast from '../../components/Toast';

export default function PlannerPage() {
  const { user, loading } = useAuth();
  const { isPremium, isTrialActive, trialDaysLeft, loading: loadingPremium } = usePremium(user);
  const router = useRouter();
  const [monthlyPlans, setMonthlyPlans] = useState<MonthlyPlan[]>([]);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanAmount, setNewPlanAmount] = useState('');
  const [newPlanCategory, setNewPlanCategory] = useState('');
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingAmount, setEditingAmount] = useState('');
  const [editingCategory, setEditingCategory] = useState('');
  const [loadingPlans, setLoadingPlans] = useState(true);
  const { toasts, showToast, hideToast } = useToast();

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchMonthlyPlans();
    }
  }, [user]);

  const fetchMonthlyPlans = async () => {
    if (!user) return;
    
    try {
      setLoadingPlans(true);
      const plansRef = collection(db, 'monthlyPlans');
      const q = query(
        plansRef,
        where('userId', '==', user.uid),
        where('month', '==', currentMonth)
      );
      const snapshot = await getDocs(q);
      const fetchedPlans = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Migration: Handle old structure (text) and new structure (title + amount)
        // If plan has old structure, skip it or provide defaults
        if (!data.amount || data.amount === undefined) {
          // Old plan structure - skip it
          return null;
        }
        
        return {
          id: doc.id,
          userId: data.userId,
          title: data.title || data.text || 'Без названия',
          amount: data.amount || 0,
          category: data.category,
          isCompleted: data.isCompleted || false,
          month: data.month,
          createdAt: data.createdAt,
        } as MonthlyPlan;
      }).filter(plan => plan !== null) as MonthlyPlan[];
      
      setMonthlyPlans(fetchedPlans);
    } catch (error) {
      console.error('Error fetching monthly plans:', error);
      showToast('Ошибка загрузки планов', 'error');
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleAddPlan = async () => {
    if (!newPlanTitle.trim() || !newPlanAmount || !user) return;
    
    const amount = parseFloat(newPlanAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Введите корректную сумму', 'error');
      return;
    }
    
    try {
      const plansRef = collection(db, 'monthlyPlans');
      const newPlan = {
        userId: user.uid,
        title: newPlanTitle.trim(),
        amount: amount,
        category: newPlanCategory.trim() || undefined,
        isCompleted: false,
        month: currentMonth,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(plansRef, newPlan);
      setMonthlyPlans([...monthlyPlans, { id: docRef.id, ...newPlan }]);
      setNewPlanTitle('');
      setNewPlanAmount('');
      setNewPlanCategory('');
      showToast('План добавлен', 'success');
    } catch (error) {
      console.error('Error adding plan:', error);
      showToast('Ошибка при добавлении плана', 'error');
    }
  };

  const handleToggleComplete = async (planId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'monthlyPlans', planId), {
        isCompleted: !currentStatus,
      });
      
      setMonthlyPlans(plans =>
        plans.map(plan =>
          plan.id === planId ? { ...plan, isCompleted: !currentStatus } : plan
        )
      );
    } catch (error) {
      console.error('Error toggling plan:', error);
      showToast('Ошибка при обновлении плана', 'error');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Удалить этот план?')) return;
    
    try {
      await deleteDoc(doc(db, 'monthlyPlans', planId));
      setMonthlyPlans(plans => plans.filter(plan => plan.id !== planId));
      showToast('План удален', 'success');
    } catch (error) {
      console.error('Error deleting plan:', error);
      showToast('Ошибка при удалении плана', 'error');
    }
  };

  const handleStartEdit = (plan: MonthlyPlan) => {
    setEditingPlanId(plan.id);
    setEditingTitle(plan.title);
    setEditingAmount(plan.amount.toString());
    setEditingCategory(plan.category || '');
  };

  const handleSaveEdit = async (planId: string) => {
    if (!editingTitle.trim() || !editingAmount) return;
    
    const amount = parseFloat(editingAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Введите корректную сумму', 'error');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'monthlyPlans', planId), {
        title: editingTitle.trim(),
        amount: amount,
        category: editingCategory.trim() || undefined,
      });
      
      setMonthlyPlans(plans =>
        plans.map(plan =>
          plan.id === planId 
            ? { ...plan, title: editingTitle.trim(), amount: amount, category: editingCategory.trim() || undefined } 
            : plan
        )
      );
      setEditingPlanId(null);
      setEditingTitle('');
      setEditingAmount('');
      setEditingCategory('');
      showToast('План обновлен', 'success');
    } catch (error) {
      console.error('Error updating plan:', error);
      showToast('Ошибка при обновлении плана', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingPlanId(null);
    setEditingTitle('');
    setEditingAmount('');
    setEditingCategory('');
  };

  if (loading || loadingPremium || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  const completedPlans = monthlyPlans.filter(p => p.isCompleted).length;
  const completionRate = monthlyPlans.length > 0 ? (completedPlans / monthlyPlans.length) * 100 : 0;
  
  // Calculate financial summary
  const totalPlannedAmount = monthlyPlans.reduce((sum, plan) => sum + (plan.amount || 0), 0);
  const totalCompletedAmount = monthlyPlans
    .filter(plan => plan.isCompleted)
    .reduce((sum, plan) => sum + (plan.amount || 0), 0);
  const remainingAmount = totalPlannedAmount - totalCompletedAmount;

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        userEmail={user.email} 
        isPremium={isPremium}
        isTrialActive={isTrialActive}
        trialDaysLeft={trialDaysLeft}
      />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8 w-full max-w-full">
        <div className="max-w-5xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Планировщик бюджета</h1>

          {/* Monthly Plans Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Планы на {new Date(currentMonth).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
              </h2>
              {monthlyPlans.length > 0 && (
                <div className="text-sm text-gray-600">
                  Выполнено: {completedPlans}/{monthlyPlans.length} ({completionRate.toFixed(0)}%)
                </div>
              )}
            </div>

            {/* Financial Summary */}
            {monthlyPlans.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Финансовая сводка</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Запланировано</p>
                    <p className="text-lg font-bold text-blue-600">
                      {totalPlannedAmount.toLocaleString('ru-RU')} с
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Выполнено</p>
                    <p className="text-lg font-bold text-green-600">
                      {totalCompletedAmount.toLocaleString('ru-RU')} с
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Осталось</p>
                    <p className="text-lg font-bold text-orange-600">
                      {remainingAmount.toLocaleString('ru-RU')} с
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Add Plan Form */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Добавить новый план</h3>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <input
                  type="text"
                  value={newPlanTitle}
                  onChange={(e) => setNewPlanTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && newPlanAmount && handleAddPlan()}
                  placeholder="Название плана (например: Купить продукты)"
                  className="sm:col-span-5 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="number"
                  value={newPlanAmount}
                  onChange={(e) => setNewPlanAmount(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && newPlanTitle && handleAddPlan()}
                  placeholder="Сумма (сом)"
                  min="0"
                  step="0.01"
                  className="sm:col-span-3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="text"
                  value={newPlanCategory}
                  onChange={(e) => setNewPlanCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && newPlanTitle && newPlanAmount && handleAddPlan()}
                  placeholder="Категория (опционально)"
                  className="sm:col-span-3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleAddPlan}
                  disabled={!newPlanTitle.trim() || !newPlanAmount}
                  className="sm:col-span-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Plans List */}
            {loadingPlans ? (
              <div className="text-center py-8 text-gray-500">Загрузка планов...</div>
            ) : monthlyPlans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Нет планов на этот месяц. Добавьте первый план!
              </div>
            ) : (
              <div className="space-y-2">
                {monthlyPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      plan.isCompleted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleComplete(plan.id, plan.isCompleted)}
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        plan.isCompleted
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {plan.isCompleted && <span className="text-white text-sm">✓</span>}
                    </button>

                    {/* Plan Content */}
                    {editingPlanId === plan.id ? (
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(plan.id)}
                          className="sm:col-span-5 px-3 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          autoFocus
                        />
                        <input
                          type="number"
                          value={editingAmount}
                          onChange={(e) => setEditingAmount(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(plan.id)}
                          placeholder="Сумма"
                          min="0"
                          step="0.01"
                          className="sm:col-span-3 px-3 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          type="text"
                          value={editingCategory}
                          onChange={(e) => setEditingCategory(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(plan.id)}
                          placeholder="Категория"
                          className="sm:col-span-4 px-3 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <span
                            className={`block font-medium ${
                              plan.isCompleted
                                ? 'line-through text-gray-500'
                                : 'text-gray-900'
                            }`}
                          >
                            {plan.title || 'Без названия'}
                          </span>
                          {plan.category && (
                            <span className="text-xs text-gray-500">
                              {plan.category}
                            </span>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <span
                            className={`text-lg font-bold ${
                              plan.isCompleted
                                ? 'text-gray-400 line-through'
                                : 'text-blue-600'
                            }`}
                          >
                            {(plan.amount || 0).toLocaleString('ru-RU')} с
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {editingPlanId === plan.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(plan.id)}
                            className="text-green-600 hover:text-green-700 px-2 py-1 text-sm"
                            title="Сохранить"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-700 px-2 py-1 text-sm"
                            title="Отмена"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(plan)}
                            className="text-blue-600 hover:text-blue-700 px-2 py-1 text-sm"
                            title="Редактировать"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="text-red-600 hover:text-red-700 px-2 py-1 text-sm"
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
