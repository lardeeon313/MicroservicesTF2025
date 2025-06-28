//NUEVO: 
import React,{useState} from "react";
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { MarkItemIsReady } from "../../../services/PostAddPackings";
import { UnMarkItemIsReady } from "../../../services/PostAddPackings";
import type { MarkItemCommand } from "../../../types/AddPackings";
import type { UnMarkItemReadyCommand } from "../../../types/AddPackings";
//
import AddPackingForm from "../AddPackings/AddPackingForm";
//harcodeado cambiar despues por un asiggned Real 
const user = { name: "Juan Pérez", role: "Operario", id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa" };
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
};

const ItemOrdersComponent: React.FC<Props>  = ({ operatorUserId, pedidoItems }) => {
    const [items, setItems] = useState<OrderItem[]>(pedidoItems);

      const handleMarkToggle = async (item: OrderItem) => {
    try {
      if (item.marcado) {
        const data: UnMarkItemReadyCommand = { OrderItemId: item.id };
        await UnMarkItemIsReady(data);
        Alert.alert('Éxito', 'Ítem desmarcado');
      } else {
        const data: MarkItemCommand = { OrderItemId: item.id, OperatorUserId: operatorUserId};
        await MarkItemIsReady(data);
        Alert.alert('Éxito', 'Ítem marcado como listo');
      }

      setItems(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, marcado: !i.marcado } : i
        )
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar ítem');
    }
  };

  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{
          backgroundColor: item.marcado ? '#d4edda' : '#fff', // verde claro si está listo
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,shadowRadius: 4,
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
                Producto: {item.nombre}
            </Text>
            <Text style={{ fontSize: 14, color: 'gray',fontWeight: '500', marginBottom: 2, }}>
                Embalaje: {item.embalaje}
            </Text>
            <Text style={{ fontSize: 14, color: '#555' }}>
                Cantidad: {item.cantidad}
            </Text>
            {/**para que el operario agrege el packing que desee:  */}
            <AddPackingForm depotOrderItemId={item.id} />
          <Button
            title={item.marcado ? '❌ Desmarcar' : '✅ Marcar como listo'}
            color={item.marcado ? 'red' : 'green'}
            onPress={() => handleMarkToggle(item)}
          />
        </View>
      )}
    />
  );
}

export default ItemOrdersComponent;