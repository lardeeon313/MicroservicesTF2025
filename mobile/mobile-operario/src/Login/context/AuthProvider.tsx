import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import { getUserIdFromToken, getTokenPayload, getRoleFromToken, getNameFromToken } from '../Utils/jwlUtils';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          setUserId(getUserIdFromToken(storedToken));
          setRole(getRoleFromToken(storedToken));
          setName(getNameFromToken(storedToken));
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
      setUserId(getUserIdFromToken(newToken));
      setRole(getRoleFromToken(newToken));
      setName(getNameFromToken(newToken));
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUserId(null);
      setRole(null);
      setName(null);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, userId, name, role, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
