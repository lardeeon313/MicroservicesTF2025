import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { OrderStatusLabels } from "../../constants/UseStatusOrderOperator";
import { MissingCountContainer } from "./MissingCount";
import type {DepotOrderMissingDTO } from "../../types/Missing";
import { DepotOrderDTO, DepotOrderStatus } from "../../types/OrderDTO";

import { useAuth } from "../../../Login/context/useAuth";

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
  return(
    <View style={{backgroundColor: '#fff',padding: 16,borderRadius: 12,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,elevation: 2,marginBottom: 16}}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Pedido# : {depotOrderId.toString()}
      </Text>
      <Text style={{ fontSize: 20, fontWeight: '300', marginTop: 4 }}>
        Cliente : {customerName}
      </Text>

      <View style={{flexDirection: 'row', gap: 10, marginTop: 16}} >
        <TouchableOpacity style={{ backgroundColor: '#3B82F6', padding: 8, borderRadius: 10 }} onPress={onVerDetalle}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Ver detalle </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 8, backgroundColor: '#EF4444', borderRadius: 10}} onPress={onEmitirFaltante}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Emitir Faltante</Text>
        </TouchableOpacity>
      </View>

      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
        {onSeccionNotificaciones && (
          <TouchableOpacity style={{marginTop: 10,padding: 8,backgroundColor: '#ff8000',borderRadius: 10,}}onPress={onSeccionNotificaciones}>
            <Text style={{ color: '#fff', textAlign: 'center',fontWeight:'bold' }}>ATENCION: Revisar faltantes del Pedido</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={{ fontSize: 20, color: '#6B7280', marginTop: 8 }}>
        Estado: {OrderStatusLabels[status as DepotOrderStatus]}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>
        Total de faltantes: 
      </Text>

      <MissingCountContainer depotOrderId={order.depotOrderId} operatorUserId={user.id} />

    </View> 
  )
}; 

export default ListOfMissingOrders;