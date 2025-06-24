import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { RegisterFields } from './RegisterFields';
import { register } from '../../services/AuthService';
import { registerValidationSchema } from '../../validations/validationschema';
import type { RegisterRequest } from '../../types/AuthTypes';

export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const handleSubmit = async (values: RegisterRequest) => {
    try {
      await register(values);
      alert('Registro exitoso!');
      onSuccess();
    } catch (error) {
      alert('Error en el registro');
    }
  };

  return (
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
      {(formik) => (
        <View style={{ padding: 20 }}>
          <RegisterFields formik={formik} />
          <Button title="Registrarse" onPress={formik.handleSubmit as any} />
        </View>
      )}
    </Formik>
  );
};

