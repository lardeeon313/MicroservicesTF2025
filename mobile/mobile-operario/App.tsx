/*import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
//import { AuthProvider } from './src/operario/components/login/AuthContext';
import { AuthProvider } from './src/Login/context/AuthProvider';
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

*/
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/operario/Login/context/AuthProvider';
import DepotNavigator from './src/operario/navigation/DepotNativagator';
import LoginNavigator from './src/operario/Login/LoginNavigator/LoginNavigator';
import { useAuth } from './src/operario/Login/context/useAuth';
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
