import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

type Props = {
  description: string;
  onNotifyMissing: (text: string) => void;
  onSubmit: () => void;
};

const MissingReport = ({ description, onNotifyMissing, onSubmit }: Props) => {
  return (
    <View style={{ padding: 20, backgroundColor: '#fff', flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        Emitir Notificación{"\n"}del Faltante
      </Text>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        Informar al encargado del depósito:
      </Text>

      <Text style={{ fontSize: 14, marginBottom: 5 }}>
        Detalle los faltantes con una breve descripción:
      </Text>

      <TextInput style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 8, borderRadius: 4 }}
        multiline
        numberOfLines={4}
        placeholder="Coloque el texto aquí..."
        value={description}
        onChangeText={onNotifyMissing}
      />

      <TouchableOpacity
        style={{ backgroundColor: '#F59E0B', padding: 12, borderRadius: 8 }}
        onPress={onSubmit}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          Enviar Notificación
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MissingReport;



// This component allows the user to report a missing item with a description.