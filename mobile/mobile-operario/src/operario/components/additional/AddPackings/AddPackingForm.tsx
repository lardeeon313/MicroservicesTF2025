import React, { useState } from "react";
import {View,Text,TextInput,Button,ActivityIndicator,StyleSheet,Alert} from 'react-native';
import { useAddPackagings } from "../../../hocks/useAddPackings";
import type { AddPackingCommand } from "../../../types/AddPackings";
import { DepotOrderStatus } from "../../../types/OrderDTO";
import { AlertCircle } from "lucide-react-native";

type Props = {
  depotOrderItemId: number;
  onSuccess?: () => void;
  pedidoStatus: DepotOrderStatus;
};

const AddPackingForm: React.FC<Props> = ({ depotOrderItemId, onSuccess, pedidoStatus }) => {
  const [packagingType, setPackagingType] = useState('');
  const { addPackagings, loading, error, success } = useAddPackagings();

  // Se desactiva si está en estos estados
  const isDisabled = [
    DepotOrderStatus.Assigned,
    DepotOrderStatus.MissingProduct,
    DepotOrderStatus.SentToBilling,
  ].includes(pedidoStatus);

  // Mensaje según el estado
  let disabledMessage: string | null = null;

  if (pedidoStatus === DepotOrderStatus.SentToBilling) {
    disabledMessage = 'Este pedido ya fue facturado. Ya no puedes realizar más acciones.';
  } else if (
    pedidoStatus === DepotOrderStatus.Assigned ||
    pedidoStatus === DepotOrderStatus.MissingProduct
  ) {
    disabledMessage = 'Para realizar las acciones, primero se deben resolver los productos faltantes o confirmar el pedido.';
  }

  const handleSubmit = async () => {
    if (!packagingType.trim()) {
      Alert.alert('Error', 'El tipo de empaque no puede estar vacío.');
      return;
    }

    const payload: AddPackingCommand = {
      packagingItems: [
        {
          depotOrderItemId: depotOrderItemId,
          packagingType: packagingType.trim()
        }
      ]
    };

    await addPackagings(payload);

    if (onSuccess && !error) {
      onSuccess();
    }
  };

  return (
    <View style={{marginTop: 10,padding: 10,backgroundColor: '#f2f2f2',borderRadius: 8}}>
      <Text style={{fontWeight: 'bold',marginBottom: 6}}>Agregar tipo de empaque:</Text>

      <TextInput
        style={[
          {borderWidth: 1,borderColor: '#ccc',padding: 8,borderRadius: 4,marginBottom: 10},
          { backgroundColor: isDisabled ? "#eee" : "#fff" }
        ]}
        placeholder="Ej: Caja, Bolsa, Enlatado..."
        value={packagingType}
        onChangeText={setPackagingType}
        editable={!isDisabled}
      />

      {isDisabled && disabledMessage && (
      <View style={{flexDirection: 'column',alignItems: 'center',marginBottom: 10}}>
        <AlertCircle
          color={pedidoStatus === DepotOrderStatus.SentToBilling ? 'green' : 'red'}
          size={18}
          style={{ marginBottom: 6 }}
        />
        <Text
            style={[
              {color: 'red',fontStyle: 'normal',textAlign: 'center'},
              pedidoStatus === DepotOrderStatus.SentToBilling && { color: 'green' }
            ]}
            >
          {disabledMessage}
        </Text>
      </View>
      )}

      {loading ? (
        <ActivityIndicator size="small" color="#007bff" />
      ) : (
        <Button
          title="Agregar empaque"
          onPress={handleSubmit}
          disabled={isDisabled}
        />
      )}

      {error && <Text style={{color: 'red',marginTop: 6}}>Error: {error.message}</Text>}
      {success && (
        <Text style={{color: 'green',marginTop: 6}}>✅ Empaque agregado con éxito ✅.</Text>
      )}
    </View>
  );
};

export default AddPackingForm;
