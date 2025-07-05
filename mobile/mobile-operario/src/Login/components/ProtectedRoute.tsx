// En tu archivo de navegación (ej: AppNavigator.tsx)
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/useAuth';
import LoginForm from './LoginForm';
import Unauthorized from './Unathorized';
import { getRoleFromToken } from '../Utils/jwlUtils';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { token, isAuthenticated } = useAuth();

  const role = token ? getRoleFromToken(token) : null;

  return (
    <Stack.Navigator>
        {!isAuthenticated ? (
            <Stack.Screen name="Login" component={LoginForm} options={{ headerShown: false }} />
        ) : role !== 'Admin' ? (
        <Stack.Screen name="Unauthorized" component={Unauthorized} />
        ) : (
        // En vez de AdminDashboard, podés redirigir a Unauthorized, Login o lo que sea
        <Stack.Screen name="Unauthorized" component={Unauthorized} />
        )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
