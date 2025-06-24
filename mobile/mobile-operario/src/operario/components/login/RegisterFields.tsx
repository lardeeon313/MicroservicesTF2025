import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import type { FormikProps } from 'formik';
//import type { RegisterRequest } from '../../../types/AuthTypes';
import type { RegisterRequest } from '../../types/AuthTypes';

interface Props {
  formik: FormikProps<RegisterRequest>;
}

export const RegisterFields = ({ formik }: Props) => {
  const { handleChange, handleBlur, values, errors, touched, setFieldValue } = formik;

  const renderError = (field: keyof RegisterRequest) =>
    touched[field] && errors[field] ? <Text style={styles.error}>{errors[field]}</Text> : null;

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={values.userName}
        onChangeText={handleChange('userName')}
        onBlur={handleBlur('userName')}
      />
      {renderError('userName')}

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={values.name}
        onChangeText={handleChange('name')}
        onBlur={handleBlur('name')}
      />
      {renderError('name')}

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={values.lastName}
        onChangeText={handleChange('lastName')}
        onBlur={handleBlur('lastName')}
      />
      {renderError('lastName')}

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={values.email}
        onChangeText={handleChange('email')}
        onBlur={handleBlur('email')}
        keyboardType="email-address"
      />
      {renderError('email')}

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={values.password}
        onChangeText={handleChange('password')}
        onBlur={handleBlur('password')}
        secureTextEntry
      />
      {renderError('password')}

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={values.confirmPassword}
        onChangeText={handleChange('confirmPassword')}
        onBlur={handleBlur('confirmPassword')}
        secureTextEntry
      />
      {renderError('confirmPassword')}

      <RNPickerSelect
        onValueChange={(value) => setFieldValue('role', value)}
        items={[
          { label: 'Operario Depósito', value: 'DepotOperator' },
          { label: 'Encargado Depósito', value: 'DepotManager' },
          { label: 'Ventas', value: 'SalesStaff' },
          { label: 'Admin', value: 'Admin' },
          { label: 'Logística', value: 'Delivery' },
          { label: 'Facturación', value: 'BillingManager' },
          { label: 'Verificación', value: 'VerificationStaff' },
        ]}
        placeholder={{ label: 'Selecciona un rol', value: '' }}
      />
      {renderError('role')}
    </View>
  );
};

const styles = StyleSheet.create({
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
  error: { color: 'red', fontSize: 12 },
});
