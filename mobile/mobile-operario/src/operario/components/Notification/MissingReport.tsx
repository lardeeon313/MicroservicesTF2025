import React from 'react';
import { View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import type { ReportOrderMissingRequest } from '../../types/Missing';
import { DepotOrderDTO } from '../../types/OrderDTO';

type Props = {
  description: string;
  onNotifyMissing: (text: string) => void;
  onSubmit: () => void;
  missing: DepotOrderDTO;
};

const MissingReport = ({ description, onNotifyMissing, onSubmit }: Props) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', padding: 20 }}>
      {/* Encabezado */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Image
          source={require('../../../assetsImages/LogoVerona.png')}
          style={{
            width: 42,
            height: 42,
            resizeMode: 'contain',
            marginRight: 10,
            
          }}
        />
      </View>

      {/* Título */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 10 }}>
        Emitir Notificación{'\n'}del Faltante
      </Text>

      <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
        Informar al encargado del depósito:
      </Text>

      {/* Instrucción */}
      <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 6 }}>
        Detalle los faltantes con una breve descripción:
      </Text>

      {/* Campo de texto */}
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#d1d5db',
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 12,
          fontSize: 14,
          textAlignVertical: 'top',
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        }}
        multiline
        numberOfLines={5}
        placeholder="Coloque el texto aquí..."
        value={description}
        onChangeText={onNotifyMissing}
      />

      {/* Botón */}
      <TouchableOpacity
        style={{
          backgroundColor: '#f59e0b',
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        }}
        onPress={onSubmit}
      >
        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
          Enviar Notificación
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MissingReport;



// This component allows the user to report a missing item with a description.