// src/pages/LoginPage.tsx
import React from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../components/login/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DepotStackParamList } from '../../types/DepotStackType';
import LoginForm from '../../components/login/LoginForm';

export const LoginPage = () => {
  //const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

  const handleLogin = async (operatorId: string) => {
    try {
      //await login(operatorId);
      Alert.alert('Éxito', 'Sesión iniciada correctamente');
      navigation.navigate('OperatorDashboard');
    } catch (error) {
      Alert.alert('Error', 'Operador no encontrado');
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};
