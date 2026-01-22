import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from '../components/LoginForm'; // Ajustá si tu LoginForm está en otra carpeta
import RegisterForm from '../components/RegisterForm'; // Opcional si tenés registro
import { CreatePasswordPage } from '../pages/CreatePasswordPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';

export type LoginStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  CreatePassword: {
    userId: string;
  };
  ResetPassword: {
    email: string;
    token: string;
  };
};

const Stack = createNativeStackNavigator<LoginStackParamList>();

const LoginNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginForm} />
      <Stack.Screen name="Register" component={RegisterForm} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
      <Stack.Screen name="CreatePassword" component={CreatePasswordPage} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordPage} />
    </Stack.Navigator>
  );
};

export default LoginNavigator;
