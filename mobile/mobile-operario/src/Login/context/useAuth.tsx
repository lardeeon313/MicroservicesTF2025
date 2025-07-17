import { useContext } from 'react';
import { authContextType } from '../types/AuthType';
import { AuthContext } from './AuthContext';

export const useAuth = (): authContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider.');
  }
  return context;
};
