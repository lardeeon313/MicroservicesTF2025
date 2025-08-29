import React from 'react';
import {View,Text,TextInput,TouchableOpacity,Image,StyleSheet,Alert,KeyboardAvoidingView,Platform,ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import { registerValidationSchema } from '../validations/registerValidation';
import { register } from '../services/AuthService';
import { RegisterRequest } from '../types/AuthType';
import { useNavigation } from '@react-navigation/native';

const logoVerona = require('../../../assetsImages/LogoVerona.png');

const RegisterForm = () => {
  const navigation = useNavigation();

  const handleSubmit = async (values: RegisterRequest) => {
    try {
      await register(values);
      Alert.alert('Éxito', 'Registro exitoso! Ahora podés iniciar sesión.');
      navigation.navigate('Login' as never);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error inesperado');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={logoVerona} style={styles.logo} />
        <Text style={styles.title}>Registrarse</Text>

        <Formik
          initialValues={{
            userName: '',
            name: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '',
          }}
          validationSchema={registerValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <>
              {[
                { key: 'userName', label: 'Usuario', placeholder: 'Tu usuario', secure: false },
                { key: 'name', label: 'Nombre', placeholder: 'Tu nombre', secure: false },
                { key: 'lastName', label: 'Apellido', placeholder: 'Tu apellido', secure: false },
                { key: 'email', label: 'Correo electrónico', placeholder: 'tu-correo@gmail.com', secure: false, keyboardType: 'email-address' },
                { key: 'password', label: 'Contraseña', placeholder: 'Contraseña', secure: true },
                { key: 'confirmPassword', label: 'Confirmar contraseña', placeholder: 'Confirmar contraseña', secure: true },
              ].map(({ key, label, placeholder, secure, keyboardType }) => (
                <View key={key} style={styles.inputContainer}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    secureTextEntry={secure}
                    keyboardType={(keyboardType as any) || 'default'}
                    autoCapitalize="none"
                    onChangeText={handleChange(key)}
                    onBlur={handleBlur(key)}
                    value={(values as any)[key]}
                  />
                  {touched[key as keyof typeof touched] && (errors as any)[key] && (
                    <Text style={styles.error}>{(errors as any)[key]}</Text>
                  )}
                </View>
              ))}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Rol</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.role}
                    onValueChange={(value) => setFieldValue('role', value)}
                    onBlur={handleBlur('role')}
                  >
                    <Picker.Item label="Selecciona un rol..." value="" />
                    <Picker.Item label="Admin" value="Admin" />
                    <Picker.Item label="SalesStaff" value="SalesStaff" />
                    <Picker.Item label="BillingManager" value="BillingManager" />
                    <Picker.Item label="DepotManager" value="DepotManager" />
                    <Picker.Item label="DepotOperator" value="DepotOperator" />
                    <Picker.Item label="Delivery" value="Delivery" />
                    <Picker.Item label="VerificationStaff" value="VerificationStaff" />
                  </Picker>
                </View>
                {touched.role && errors.role && <Text style={styles.error}>{errors.role}</Text>}
              </View>

              <TouchableOpacity onPress={() => handleSubmit()} style={styles.button}>
                <Text style={styles.buttonText}>Registrarse</Text>
              </TouchableOpacity>

              <Text style={styles.footerText}>
                ¿Ya tenés cuenta?{' '}
                <Text style={styles.linkText} onPress={() => navigation.navigate('Login' as never)}>
                  Iniciar Sesión
                </Text>
              </Text>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterForm;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#b91c1c',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#888',
  },
  linkText: {
    color: '#b91c1c',
    fontWeight: 'bold',
  },
});
