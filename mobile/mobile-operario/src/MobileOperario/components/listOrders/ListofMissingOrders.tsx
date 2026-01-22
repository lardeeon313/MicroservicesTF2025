import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { OrderStatusLabels } from "../../constants/UseStatusOrderOperator";
import { MissingCountContainer } from "./MissingCount";
import type {DepotOrderMissingDTO } from "../../types/Missing";
import { DepotOrderDTO, DepotOrderStatus } from "../../types/OrderDTO";
import { ListCollapse , TriangleAlert, ListTodo} from "lucide-react-native";

import { useAuth } from "../../Login/context/useAuth";

type Props = {
  order: DepotOrderDTO;
  missings: DepotOrderMissingDTO[];
  onVerDetalle: () => void;
  onEmitirFaltante: () => void;
  onMarcarArmado?: () => void;
  onSeccionNotificaciones: () => void;
};


const ListOfMissingOrders = ({
  order,
  onVerDetalle,
  onEmitirFaltante,
  onMarcarArmado,
  onSeccionNotificaciones
}: Props) => {

  const { userId } = useAuth();

  const user = {
    id: userId!
  }

  const { depotOrderId, customerName, status, } = order;
  const address = order.address;
  return(
    <View style={{backgroundColor: '#fff',padding: 16,borderRadius: 12,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,elevation: 2,marginBottom: 16}}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Pedido #{depotOrderId.toString()}
      </Text>

      <View style={{marginTop: 8}}>
        <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#666', fontWeight: 'bold',marginRight: 16 }}>
            Cliente: 
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '400',color: '#000'}}>
            {customerName}
          </Text>
        </View>

        <View style={{marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#666', fontWeight: 'bold',marginRight: 16 }}>
            Estado: 
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '400',color: '#000' }}>
            {OrderStatusLabels[status as DepotOrderStatus]}
          </Text>
        </View>
      </View>

        {address && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: '#f9f9f9',
            padding: 12,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              marginBottom: 6,
              color: '#333',
            }}
          >
            📍 Dirección de entrega
          </Text>

          <Text style={{ fontSize: 16, color: '#222', marginBottom: 2 }}>
            {`${address.street} ${address.number}${address.apartment ? `, ${address.apartment}` : ''}`}
          </Text>

          <Text style={{ fontSize: 15.5, color: '#444', marginBottom: 2 }}>
            {`${address.city}, ${address.province}`}
          </Text>

          <Text style={{ fontSize: 15, color: '#777' }}>
            {address.country}
          </Text>
        </View>
      )}

      <View style={{ marginTop: 16 }}>
        {/* Acciones principales */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#3B82F6',
              paddingVertical: 12,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onPress={onVerDetalle}
          >
            <ListCollapse size={20} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Ver detalle
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#E42841',
              paddingVertical: 12,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onPress={onEmitirFaltante}
          >
            <TriangleAlert size={20} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Emitir faltante
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón de atención */}
        {onSeccionNotificaciones && (
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: '#FF8000',
              paddingVertical: 12,
              paddingHorizontal: 14,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onPress={onSeccionNotificaciones}
          >
            <ListTodo size={20} color="#fff" />
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center',
                flexShrink: 1,
              }}
            >
              ATENCIÓN: Revisar faltantes del pedido
            </Text>
          </TouchableOpacity>
        )}
      </View>



      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>
        Total de faltantes: 
      </Text>

      <MissingCountContainer depotOrderId={order.depotOrderId} operatorUserId={user.id} />

    </View> 
  )
}; 

export default ListOfMissingOrders;