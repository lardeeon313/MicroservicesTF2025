import { createContext } from 'react';
import { authContextType } from '../types/AuthType';

export const AuthContext = createContext<authContextType>({
  userId: null,
  name: null,
  role: null,
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  loading: true,
  team: null,
});
