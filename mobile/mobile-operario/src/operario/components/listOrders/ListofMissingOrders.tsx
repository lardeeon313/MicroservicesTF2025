//listado de los pedidos con faltantes
import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { OrderStatusLabels } from "../../constants/UseStatusOrderOperator";
import MissingCount from "./MissingCount";
import type { Missing } from "../../types/Missing";
import { OrderStatus } from "../../../otherTypes/OrderType";

type Props = {
  id: number;
  customer: string;
  status: string;
  missingCount: Missing[];
  onVerDetalle: () => void;
  onEmitirFaltante: () => void;
  onMarcarArmado?: () => void;
  onSeccionNotificaciones: () => void;
};

const ListOfMissingOrders = ({id,customer,status,missingCount,onVerDetalle,onEmitirFaltante,onMarcarArmado,onSeccionNotificaciones}: Props) => {
  return(
    <View style={{backgroundColor: '#fff',padding: 16,borderRadius: 12,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,elevation: 2,marginBottom: 16,}}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Pedido# {id.toString()}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Cliente :  {customer}</Text>

      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 16}} >
        <TouchableOpacity style={{ backgroundColor: '#3B82F6', padding: 8, borderRadius: 10 }} onPress={onVerDetalle}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Ver detalle </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 8, backgroundColor: '#EF4444', borderRadius: 10}} onPress={onEmitirFaltante}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Emitir Faltante</Text>
        </TouchableOpacity>
      </View>

      {onMarcarArmado && OrderStatus.InPreparation && (
        <TouchableOpacity style={{marginTop: 10,padding: 8,backgroundColor: '#10B981',borderRadius: 10,}}onPress={onMarcarArmado}>
          <Text style={{ color: '#fff', textAlign: 'center',fontWeight:'bold' }}>Marcar como Armado</Text>
        </TouchableOpacity>
      )}

      {onSeccionNotificaciones && (
        <TouchableOpacity style={{marginTop: 10,padding: 8,backgroundColor: '#F59E0B',borderRadius: 10,}}onPress={onSeccionNotificaciones}>
          <Text style={{ color: '#fff', textAlign: 'center',fontWeight:'bold' }}>Revisar todas las notifaciones del pedido</Text>
        </TouchableOpacity>
      )}

      <Text style={{ fontSize: 20, color: '#6B7280', marginTop: 8 }}>
        Estado: {OrderStatusLabels[status as keyof typeof OrderStatusLabels] ?? status}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>
        Total de faltantes: {missingCount.length}
      </Text>

      <MissingCount items={missingCount} />
    </View> 
  )
}; 

export default ListOfMissingOrders;