'use client';

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const savedUser = localStorage.getItem('gameHub_user');
    console.log(savedUser);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('gameHub_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('gameHub_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = (userData) => {
    // In a real app, you'd send this to a server
    // For now, we'll just save it locally
    const existingUsers = JSON.parse(localStorage.getItem('gameHub_users') || '[]');
    
    // Check if user already exists
    const userExists = existingUsers.find(u => u.email === userData.email);
    if (userExists) {
      throw new Error('User already exists with this email');
    }
    
    // Add new user
    existingUsers.push(userData);
    localStorage.setItem('gameHub_users', JSON.stringify(existingUsers));
    
    // Auto login after registration
    login(userData);
  };

  const logout = () => {
    localStorage.removeItem('gameHub_user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading
  };
};

