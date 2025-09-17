import React, { useState } from "react";
import { View, Text, FlatList, Button, Alert  } from 'react-native';
import { MarkItemIsReady } from "../../../services/PostAddPackings";
import { UnMarkItemIsReady } from "../../../services/PostAddPackings";
import type { MarkItemCommand } from "../../../types/AddPackings";
import type { UnMarkItemReadyCommand } from "../../../types/AddPackings";
import AddPackingForm from "../AddPackings/AddPackingForm";
import { DepotOrderStatus } from "../../../types/OrderDTO";

type OrderItem = {
  id: number;
  nombre: string;
  marcado: boolean;
  embalaje: string;
  cantidad: number;
};

type Props = {
  operatorUserId: string;
  pedidoItems: OrderItem[];
  pedidoStatus: DepotOrderStatus;
};

const ItemOrdersComponent: React.FC<Props> = ({ operatorUserId, pedidoItems, pedidoStatus }) => {
  const [items, setItems] = useState<OrderItem[]>(pedidoItems);

  const isDisabled = [
    DepotOrderStatus.Assigned,
    DepotOrderStatus.MissingProduct,
    DepotOrderStatus.SentToBilling,
  ].includes(pedidoStatus);

  const handleMarkToggle = async (item: OrderItem) => {
    try {
      if (item.marcado) {
        const data: UnMarkItemReadyCommand = { orderItemId: item.id };
        await UnMarkItemIsReady(data);
        Alert.alert('Éxito', 'Ítem desmarcado');
      } else {
        const data: MarkItemCommand = { orderItemId: item.id, operatorUserId: operatorUserId };
        await MarkItemIsReady(data);
        Alert.alert('Éxito', 'Ítem marcado como listo');
      }

      const updatedItems = items.map(i =>
        i.id === item.id ? { ...i, marcado: !i.marcado } : i
      );

      setItems(updatedItems);

      const allMarked = updatedItems.every(i => i.marcado);
      if (allMarked) {
        Alert.alert('¡Enhorabuena!', 'Se han marcado todos los productos de este pedido. Ahora se encuentra en la lista de pedidos armados.');
      }

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar ítem');
    }
  };

  return (
  <View style={{ flex: 1, padding: 2,borderRadius: 12,}}>
    {pedidoStatus === DepotOrderStatus.Prepared && (
      <View
        style={{
          backgroundColor: '#332f2c',
          padding: 10,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: '#efefef', fontWeight: 'bold', textAlign: 'center' }}>
          ¿Necesitas volver a mandar el pedido a preparacion? Desmarca todos los productos 
          del pedido para hacerlo. 
        </Text>
      </View>
    )}
    <FlatList
      data={items}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{
          backgroundColor: item.marcado ? '#d4edda' : '#fff',
          padding: 16,
          borderRadius: 12,              
          borderWidth: 1.5,              
          borderColor: '#ccc',           
          marginBottom: 12,
          elevation: 2,                  
          shadowColor: '#000',           
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
            Producto: {item.nombre}
          </Text>
          <Text style={{ fontSize: 14, color: 'gray', fontWeight: '500', marginBottom: 2 }}>
            Embalaje: {item.embalaje}
          </Text>
          <Text style={{ fontSize: 14, color: '#555' }}>
            Cantidad: {item.cantidad}
          </Text>

          <AddPackingForm depotOrderItemId={item.id} pedidoStatus={pedidoStatus} />

          <Button
            title={item.marcado ? '❌ Desmarcar' : '✅ Marcar como listo'}
            color={item.marcado ? 'red' : 'green'}
            onPress={() => handleMarkToggle(item)}
            disabled={isDisabled}
          />
        </View>
      )}
    />
  </View>
);

};

export default ItemOrdersComponent;

