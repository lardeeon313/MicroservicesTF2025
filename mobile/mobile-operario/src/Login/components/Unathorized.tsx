import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Unauthorized = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.status}>401</Text>
      <Text style={styles.title}>No autorizado</Text>
      <Text style={styles.message}>Lo sentimos, no estás autorizado para ingresar.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver atrás</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Unauthorized;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  status: { fontSize: 72, fontWeight: 'bold', color: '#b91c1c' },
  title: { fontSize: 32, fontWeight: '600', marginTop: 16 },
  message: { fontSize: 18, color: '#555', textAlign: 'center', marginVertical: 12 },
  button: { marginTop: 20, backgroundColor: '#b91c1c', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
