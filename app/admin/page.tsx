'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAdmin } from '@/lib/admin';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';

interface Payment {
  id: string;
  userId: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // Check admin access
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

  // Fetch payments
  useEffect(() => {
    if (user && isAdmin(user.email)) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    try {
      const paymentsRef = collection(db, 'payments');
      const snapshot = await getDocs(paymentsRef);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];
      
      // Sort by date (newest first)
      data.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      alert('Ошибка загрузки данных');
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleApprove = async (payment: Payment) => {
    if (!confirm(`Одобрить премиум для ${payment.userEmail}?`)) return;

    setProcessing(payment.id);
    try {
      // Update payment status
      await updateDoc(doc(db, 'payments', payment.id), {
        status: 'approved',
      });

      // Update user premium status
      await updateDoc(doc(db, 'users', payment.userId), {
        isPremium: true,
      });

      alert('Премиум активирован!');
      fetchPayments();
    } catch (error) {
      console.error('Error approving:', error);
      alert('Ошибка при одобрении');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (payment: Payment) => {
    if (!confirm(`Отклонить запрос от ${payment.userEmail}?`)) return;

    setProcessing(payment.id);
    try {
      await updateDoc(doc(db, 'payments', payment.id), {
        status: 'rejected',
      });

      alert('Запрос отклонен');
      fetchPayments();
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Ошибка при отклонении');
    } finally {
      setProcessing(null);
    }
  };

  if (loading || !user || !isAdmin(user.email)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'approved':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'rejected':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'approved':
        return 'Одобрено';
      case 'rejected':
        return 'Отклонено';
      default:
        return status;
    }
  };

  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const approvedCount = payments.filter(p => p.status === 'approved').length;
  const rejectedCount = payments.filter(p => p.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👑 Панель администратора
          </h1>
          <p className="text-gray-600">Управление запросами на премиум</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700 mb-1">Ожидают</p>
            <p className="text-3xl font-bold text-yellow-800">{pendingCount}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-1">Одобрено</p>
            <p className="text-3xl font-bold text-green-800">{approvedCount}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 mb-1">Отклонено</p>
            <p className="text-3xl font-bold text-red-800">{rejectedCount}</p>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Все запросы ({payments.length})
          </h2>

          {loadingPayments ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Загрузка...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Нет запросов</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className={`border-2 rounded-lg p-4 ${getStatusColor(payment.status)}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Payment Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-lg">
                          {payment.userEmail}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-white bg-opacity-50">
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                      <div className="text-sm opacity-75">
                        <p>User ID: {payment.userId}</p>
                        <p>
                          Дата:{' '}
                          {payment.createdAt?.toDate?.()?.toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }) || 'Недавно'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {payment.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(payment)}
                          disabled={processing === payment.id}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ✓ Одобрить
                        </button>
                        <button
                          onClick={() => handleReject(payment)}
                          disabled={processing === payment.id}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ✕ Отклонить
                        </button>
                      </div>
                    )}

                    {payment.status !== 'pending' && (
                      <div className="text-sm font-medium">
                        {payment.status === 'approved' && '✓ Уже одобрено'}
                        {payment.status === 'rejected' && '✕ Уже отклонено'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
