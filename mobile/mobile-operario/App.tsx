
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/MobileOperario/Login/context/AuthProvider';
import DepotNavigator from './src/MobileOperario/navigation/DepotNativagator';
import LoginNavigator from './src/MobileOperario/Login/LoginNavigator/LoginNavigator';
import { useAuth } from './src/MobileOperario/Login/context/useAuth';
import { View, ActivityIndicator, Text } from 'react-native';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth(); // ⬅️ ACA ESTÁ EL SECRETO

  if (loading) {
    // Mostrar un splash o loader mientras validás token
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <DepotNavigator /> : <LoginNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
