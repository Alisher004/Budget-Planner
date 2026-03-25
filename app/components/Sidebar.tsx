import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import PremiumBadge from './PremiumBadge';

interface SidebarProps {
  userEmail: string | null;
  isPremium?: boolean;
}

export default function Sidebar({ userEmail, isPremium = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
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
        {isPremium && (
          <div className="mt-3">
            <PremiumBadge />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const isLocked = item.premium && !isPremium;
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
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
    </div>
  );
}
