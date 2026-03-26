'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface PremiumGateProps {
  isPremium: boolean;
  isTrialActive: boolean;
  trialDaysLeft: number;
  children: ReactNode;
}

export default function PremiumGate({ isPremium, isTrialActive, trialDaysLeft, children }: PremiumGateProps) {
  const hasAccess = isPremium || isTrialActive;

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <div className="text-5xl sm:text-6xl mb-4">🔒</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Пробный период закончился
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Ваш бесплатный пробный период на 30 дней истёк. 
            Обновитесь до Premium, чтобы продолжить пользоваться 
            аналитикой, отчетами и финансовыми рекомендациями.
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

  // Show trial warning if less than 7 days left
  if (!isPremium && isTrialActive && trialDaysLeft <= 7) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Trial Warning Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-3 text-center">
          <p className="text-sm sm:text-base font-semibold">
            ⏰ Осталось {trialDaysLeft} {trialDaysLeft === 1 ? 'день' : trialDaysLeft < 5 ? 'дня' : 'дней'} пробного периода
          </p>
          <p className="text-xs sm:text-sm mt-1">
            Обновитесь до Premium, чтобы не потерять доступ
          </p>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
