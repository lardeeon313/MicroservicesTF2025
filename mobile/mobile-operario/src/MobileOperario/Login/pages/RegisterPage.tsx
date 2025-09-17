import React from 'react';
import { View, StyleSheet } from 'react-native';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <View style={styles.container}>
      <RegisterForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default RegisterPage;
