'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import PremiumBadge from './PremiumBadge';
import { useState } from 'react';

interface SidebarProps {
  userEmail: string | null;
  isPremium?: boolean;
  isTrialActive?: boolean;
  trialDaysLeft?: number;
}

export default function Sidebar({ userEmail, isPremium = false, isTrialActive = false, trialDaysLeft = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Обзор', path: '/dashboard', icon: '📊' },
    { name: 'Планировщик', path: '/dashboard/planner', icon: '💼' },
    { name: 'Калькулятор', path: '/dashboard/calculator', icon: '🧮' },
    { name: 'Ежедневные', path: '/dashboard/daily', icon: '📝' },
    { name: 'Аналитика', path: '/dashboard/analytics', icon: '📈', premium: true },
    { name: 'Отчеты', path: '/dashboard/reports', icon: '📋', premium: true },
    { name: 'Цели', path: '/dashboard/goals', icon: '🎯' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const showAdmin = userEmail && isAdmin(userEmail);
  const hasAccess = isPremium || isTrialActive;

  const closeSidebar = () => setIsOpen(false);

  const SidebarContent = () => (
    <>
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">💰 Бюджет</h1>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {userEmail?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
            <p className="text-xs text-gray-500">Пользователь</p>
          </div>
        </div>
        
        {/* Premium/Trial Badge */}
        {isPremium && (
          <div className="mt-3">
            <PremiumBadge />
          </div>
        )}
        
        {!isPremium && isTrialActive && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-blue-800">
              🎁 Пробный период
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Осталось {trialDaysLeft} {trialDaysLeft === 1 ? 'день' : trialDaysLeft < 5 ? 'дня' : 'дней'}
            </p>
          </div>
        )}
        
        {!isPremium && !isTrialActive && (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-gray-700">
              Бесплатный план
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const isLocked = item.premium && !hasAccess;
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${isLocked ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {isLocked && <span className="text-xs">🔒</span>}
                </Link>
              </li>
            );
          })}
          
          {showAdmin && (
            <li className="pt-4 border-t border-gray-200">
              <Link
                href="/admin"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === '/admin'
                    ? 'bg-purple-50 text-purple-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">👑</span>
                <span>Админ панель</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Выйти</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-white p-2 rounded-lg shadow-lg border border-gray-200"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`block h-0.5 bg-gray-800 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 bg-gray-800 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 bg-gray-800 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[45]"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Desktop: fixed, Mobile: slide-in */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-[50]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent />
      </div>
    </>
  );
}
