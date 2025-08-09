'use client';

import { createContext, useContext, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  console.log(auth.loading);

  useEffect(() => {
    if (!auth.loading) {
      // Redirect to login if not authenticated and not on public pages
      if (!auth.isAuthenticated && !['/login', '/register'].includes(pathname)) {
        router.push('/login');
      }
      // Redirect to games if authenticated and on login/register pages
      else if (auth.isAuthenticated && ['/login', '/register'].includes(pathname)) {
        router.push('/games');
      }
    }
  }, [auth.isAuthenticated, auth.loading, pathname, router]);

  if (auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-white text-xl font-semibold">Loading GameHub...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
