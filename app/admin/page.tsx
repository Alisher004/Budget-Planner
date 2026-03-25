'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAdmin } from '@/lib/admin';
import { getAllPaymentRequests, updatePaymentStatus, updateUserPremiumStatus } from '@/lib/firestore';

interface PaymentRequest {
  id: string;
  userId: string;
  userEmail: string;
  status: string;
  createdAt: any;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && user && !isAdmin(user.email)) {
      router.push('/dashboard');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && isAdmin(user.email)) {
      loadPayments();
    }
  }, [user]);

  const loadPayments = async () => {
    try {
      const data = await getAllPaymentRequests();
      setPayments(data as PaymentRequest[]);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleApprove = async (payment: PaymentRequest) => {
    if (!confirm(`Подтвердить премиум для ${payment.userEmail}?`)) return;

    setProcessingId(payment.id);
    try {
      // Update user's premium status
      await updateUserPremiumStatus(payment.userId, true);
      // Update payment status
      await updatePaymentStatus(payment.id, 'approved');
      // Reload payments
      await loadPayments();
      alert('Премиум активирован!');
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Ошибка при активации премиум');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (payment: PaymentRequest) => {
    if (!confirm(`Отклонить запрос от ${payment.userEmail}?`)) return;

    setProcessingId(payment.id);
    try {
      await updatePaymentStatus(payment.id, 'rejected');
      await loadPayments();
      alert('Запрос отклонен');
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Ошибка при отклонении запроса');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading || !user || !isAdmin(user.email)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const approvedPayments = payments.filter(p => p.status === 'approved');
  const rejectedPayments = payments.filter(p => p.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
          <p className="text-gray-600">Управление запросами на премиум</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Ожидают</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingPayments.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Одобрено</p>
            <p className="text-3xl font-bold text-green-600">{approvedPayments.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Отклонено</p>
            <p className="text-3xl font-bold text-red-600">{rejectedPayments.length}</p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ожидающие запросы</h2>
          
          {loadingPayments ? (
            <p className="text-center text-gray-500 py-8">Загрузка...</p>
          ) : pendingPayments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Нет ожидающих запросов</p>
          ) : (
            <div className="space-y-3">
              {pendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{payment.userEmail}</p>
                    <p className="text-sm text-gray-600">
                      {payment.createdAt?.toDate?.()?.toLocaleDateString('ru-RU') || 'Недавно'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(payment)}
                      disabled={processingId === payment.id}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      ✓ Одобрить
                    </button>
                    <button
                      onClick={() => handleReject(payment)}
                      disabled={processingId === payment.id}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      ✕ Отклонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Requests */}
        {approvedPayments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Одобренные запросы</h2>
            <div className="space-y-2">
              {approvedPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{payment.userEmail}</p>
                    <p className="text-sm text-gray-600">
                      {payment.createdAt?.toDate?.()?.toLocaleDateString('ru-RU') || 'Недавно'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                    Активен
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Requests */}
        {rejectedPayments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Отклоненные запросы</h2>
            <div className="space-y-2">
              {rejectedPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{payment.userEmail}</p>
                    <p className="text-sm text-gray-600">
                      {payment.createdAt?.toDate?.()?.toLocaleDateString('ru-RU') || 'Недавно'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                    Отклонен
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            ← Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}
