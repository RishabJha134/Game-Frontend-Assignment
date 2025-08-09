"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "./AuthProvider";

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  // const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  const navItems = [
    { href: "/games", label: "🎮 Games", icon: "🎮" },
    { href: "/history", label: "📜 History", icon: "📜" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/games" className="flex items-center space-x-2">
            <span className="text-2xl">🎮</span>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              GameHub
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition duration-200 ${
                  pathname === item.href
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label.split(" ")[1]}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
              Welcome,{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {user.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="md:hidden pb-4">
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition duration-200 ${
                  pathname === item.href
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">
                  {item.label.split(" ")[1]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
