import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface Props {
    onPress: () => void; 
    loading: boolean;
}

const SendToBillingComponent: React.FC<Props> = ({ onPress, loading }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>Enviar a Facturación</Text>}
    </TouchableOpacity>
  );
};

export default SendToBillingComponent;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});