'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../components/AuthProvider';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    // Create demo user if it doesn't exist
    const existingUsers = JSON.parse(localStorage.getItem('gameHub_users') || '[]');
    const demoUser = existingUsers.find(u => u.email === 'demo@gamehub.com');
    
    if (!demoUser) {
      const demoUserData = {
        name: 'Demo User',
        email: 'demo@gamehub.com',
        password: 'demo123',
        joinedAt: new Date().toISOString()
      };
      existingUsers.push(demoUserData);
      localStorage.setItem('gameHub_users', JSON.stringify(existingUsers));
    }

    // Redirect based on authentication status
    if (!loading) {
      if (isAuthenticated) {
        router.push('/games');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-white text-xl font-semibold">Loading GameHub...</div>
      </div>
    );
  }

  return null;
}