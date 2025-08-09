'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from './AuthProvider';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  if (!user) return null;

  const navItems = [
    { href: '/games', label: '🎮 Games', icon: '🎮' },
    { href: '/history', label: '📜 History', icon: '📜' }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/games" className="flex items-center space-x-2">
            <span className="text-2xl">🎮</span>
            <span className="text-xl font-bold text-gray-800">GameHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition duration-200 ${
                  pathname === item.href
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label.split(' ')[1]}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-600">
              Welcome, <span className="font-semibold text-gray-800">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition duration-200 ${
                  pathname === item.href
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label.split(' ')[1]}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
