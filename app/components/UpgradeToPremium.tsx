'use client';

import { useState } from 'react';
import { createPaymentRequest } from '@/lib/firestore';

interface UpgradeToPremiumProps {
  userId: string;
  userEmail: string;
}

export default function UpgradeToPremium({ userId, userEmail }: UpgradeToPremiumProps) {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await createPaymentRequest(userId, userEmail);
      setRequested(true);
      alert('Запрос на премиум отправлен! Ожидайте подтверждения администратора.');
    } catch (error) {
      console.error('Error creating payment request:', error);
      alert('Ошибка при отправке запроса. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  if (requested) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⏳ Ваш запрос на премиум отправлен и ожидает подтверждения
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Отправка...' : '⭐ Перейти на Premium'}
    </button>
  );
}
