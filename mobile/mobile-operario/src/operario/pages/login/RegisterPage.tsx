import React from 'react';
import { View, Text } from 'react-native';
import { RegisterForm } from '../../components/login/RegisterForm';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DepotStackParamList } from '../../types/DepotStackType';

export const RegisterPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Registro</Text>
      <RegisterForm onSuccess={() => navigation.navigate('LoginPage')} />
    </View>
  );
};
