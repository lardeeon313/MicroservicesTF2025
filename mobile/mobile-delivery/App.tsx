import { Text, View } from 'react-native';
import { useEffect } from 'react';
import { API_BASE_URL } from '@env';

export default function App() {
  useEffect(() => {
    console.log('🔗 API_BASE_URL:', API_BASE_URL);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2563eb' }}>
        Mobile delivery funcionando!
      </Text>
    </View>
  );
}
