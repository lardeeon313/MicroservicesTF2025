import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/operario/components/login/AuthContext';
import DepotNavigator from './src/operario/navigation/DepotNativagator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <DepotNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

