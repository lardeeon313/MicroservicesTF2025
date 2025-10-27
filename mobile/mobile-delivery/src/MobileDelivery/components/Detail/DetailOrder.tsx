import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Image } from "react-native";
import { DeliveryOrderTypeDto } from "../../types/DeliveryOrderTypeDto";

type Props = {
  order: DeliveryOrderTypeDto;
  onBack: () => void;
};

export default function DetailOrderComponent({ order, onBack }: Props) {
  return (
    <View style={{flex: 1, backgroundColor: '#f9f9f9', padding: 16 }}>
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

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
          Detalle del Pedido #{order.id}
      </Text>

      <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 2 }}> 
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          Pedido#: {order.id}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 4 }}>
          Cliente: {order.customer}
        </Text>
        <Text style={{ fontSize: 20, marginBottom: 4 }}>
          Dirección: {order.address}
        </Text>
        <Text style={{ fontSize: 20, marginBottom: 12 }}>
          Estado: {order.status}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 4}}>
          Pago: {order.payment}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 4}}>
          Prioridad: {order.priority}
        </Text>
<<<<<<< HEAD
=======
        <Text style={styles.label}>Fecha de entrga: </Text>
        <Text style={styles.text}>
          {order.deliveryDate
            ? new Date(order.deliveryDate).toLocaleString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }) + " hs"
            : "Sin fecha"}
        </Text>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.text}>{order.deliveryStatus}</Text>
        <Text style={styles.label}>Tipo de Pago:</Text>
        <Text style={styles.text}>{order.deliveryPayment}</Text>
        <Text style={styles.label}>Detalle del pedido: </Text>
        <Text style={styles.text}>{order.deliveryDetail}</Text>
        <Text style={styles.label}>Recibo de pago:</Text>
        <Text style={styles.text}>{order.paymentReceipt}</Text>
        <Text style={styles.label}>Prioridad:</Text>
        <Text style={styles.text}>{order.deliveryPriority}</Text>
        {order.totalAmount && (
          <>
            <Text style={styles.label}>Total:</Text>
            <Text style={[styles.text, styles.total]}>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </>
        )}
>>>>>>> aa9e73b (Desarrollo del mobile-delivery: implementación del código de Docker para que funcione con los demás microservicios, implementación de todos los endpoints del backend del mobile-delivery, cambios realizados en los Command Handler y en el código de Infrastructure de LogisticOrderRepository (había muchos filtros que impedían incluso traer pedidos))
      </View>


    </View>
  );
}
