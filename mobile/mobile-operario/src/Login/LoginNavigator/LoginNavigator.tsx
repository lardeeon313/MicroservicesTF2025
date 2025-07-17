import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from '../components/LoginForm'; // Ajustá si tu LoginForm está en otra carpeta
import RegisterForm from '../components/RegisterForm'; // Opcional si tenés registro

export type LoginStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<LoginStackParamList>();

const LoginNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginForm} />
      <Stack.Screen name="Register" component={RegisterForm} />
    </Stack.Navigator>
  );
};

export default LoginNavigator;
