'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface PremiumGateProps {
  isPremium: boolean;
  children: ReactNode;
}

export default function PremiumGate({ isPremium, children }: PremiumGateProps) {
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Премиум функция
          </h2>
          <p className="text-gray-600 mb-6">
            Эта функция доступна только для премиум пользователей. 
            Обновитесь до Premium, чтобы получить доступ к аналитике, 
            отчетам и финансовым рекомендациям.
          </p>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              ⭐ Перейти на Premium
            </Link>
            <Link
              href="/dashboard"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
