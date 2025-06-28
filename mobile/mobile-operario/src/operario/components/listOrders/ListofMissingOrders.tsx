//listado de los pedidos con faltantes
import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { OrderStatusLabels } from "../../constants/UseStatusOrderOperator";
import MissingCount from "./MissingCount";
import type { DepotOrderItemsReportedDto, DepotOrderMissingDTO } from "../../types/Missing";
import { OrderStatus } from "../../../otherTypes/OrderType";
import { DepotOrderDTO, DepotOrderStatus } from "../../types/OrderDTO";

type Props = {
  /*id: number;
  customer: string;
  status: DepotOrderStatus;
  missingCount: DepotOrderDTO[];*/
  order: DepotOrderDTO;
  onVerDetalle: () => void;
  onEmitirFaltante: () => void;
  onMarcarArmado?: () => void;
  onSeccionNotificaciones: () => void;
};

const ListOfMissingOrders = ({order,onVerDetalle,onEmitirFaltante,onMarcarArmado,onSeccionNotificaciones}: Props) => {
    const { depotOrderId, customerName, status, missings } = order;
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

      {/**SEGUNDA FILA DE BOTONES */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
        {onMarcarArmado && DepotOrderStatus.InPreparation && (
        <TouchableOpacity style={{marginTop: 10,padding: 8,backgroundColor: '#10B981',borderRadius: 10,}}onPress={onMarcarArmado}>
          <Text style={{ color: '#fff', textAlign: 'center',fontWeight:'bold' }}>Pasar A PREPARACION</Text>
        </TouchableOpacity>
      )}

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
        Total de faltantes: {missings.length}
      </Text>

      <MissingCount count={missings.length} />
    </View> 
  )
}; 

export default ListOfMissingOrders;