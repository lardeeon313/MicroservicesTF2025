import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import { loginValidationSchema } from '../validations/loginValidation';
import { login } from '../services/AuthService';
import { LoginRequest } from '../types/AuthType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/useAuth';
import { getRoleFromToken } from '../Utils/jwlUtils';
import { StackActions } from '@react-navigation/native';

const logoVerona = require('../../../assetsImages/LogoVerona.png');

const LoginForm = () => {
  const navigation = useNavigation();
  const { login: loginContext } = useAuth();

  const handleSubmit = async (values: LoginRequest) => {
      try {
    // 1. Llamada al servicio de login
    const result = await login(values);

    // 2. Guardar token en storage
    await AsyncStorage.setItem('token', result.token);

    // 3. Actualizar el contexto y esperar que se complete
    await loginContext(result.token);

    // 4. Extraer rol del token
    const role = getRoleFromToken(result.token);
    if (!role) {
      Alert.alert("Error", "Rol no encontrado en el token");
      return;
    }

    Alert.alert("Éxito", "Inicio de sesión exitoso!");

    // 5. Navegar según rol (con replace)
    switch (role) {
      case "Admin":
        navigation.dispatch(StackActions.replace('AdminDashboard'));
        break;
      case "SalesStaff":
        navigation.dispatch(StackActions.replace('SalesHome'));
        break;
      case "DepotManager":
        navigation.dispatch(StackActions.replace('Depot'));
        break;
      case "DepotOperator":
        navigation.dispatch(StackActions.replace('Operator')); // 👈 tu dashboard de operario
        break;
      case "Delivery":
        navigation.dispatch(StackActions.replace('Dashboard'));
        break;
      case "VerificationStaff":
        navigation.dispatch(StackActions.replace('Verification'));
        break;
      default:
        navigation.dispatch(StackActions.replace('Home'));
        break;
    }

  } catch (error: any) {
    Alert.alert("Error", error?.message || "Ocurrió un error inesperado");
  }
  };

  return (
    <View style={styles.container}>
      <Image source={logoVerona} style={styles.logo} />
      <Text style={styles.title}>Iniciar sesión</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TouchableOpacity onPress={() => Alert.alert('Recuperar contraseña', 'Funcionalidad no implementada')}>
              <Text style={styles.forgotPassword}>Olvidé mi contraseña</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSubmit()} style={styles.button}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              ¿Eres nuevo?{' '}
              <Text style={styles.linkText} onPress={() => navigation.navigate('Register' as never)}>
                ¡Regístrate ahora!
              </Text>
            </Text>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { width: 150, height: 150, resizeMode: 'contain', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 14, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 },
  error: { color: 'red', fontSize: 12, marginBottom: 8 },
  forgotPassword: { color: '#b91c1c', textAlign: 'right', marginBottom: 20 },
  button: { backgroundColor: '#b91c1c', padding: 12, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  footerText: { marginTop: 24, textAlign: 'center', color: '#888' },
  linkText: { color: '#b91c1c', fontWeight: 'bold' },
});
