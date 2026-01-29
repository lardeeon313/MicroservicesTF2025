import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; // para el icono de alerta

type Incident = {
  id: number;
  description: string;
  date: string;
};

type Props = {
  incidents: Incident[];
  orderId: number;
};

export default function NotificationIncidentComponent({ incidents, orderId }: Props) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>
        Incidentes del pedido#: {orderId}
      </Text>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.incidentCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <MaterialIcons name="warning" size={20} color="#331d08ff" />
              <Text style={styles.incidentTitle}>Incidente #{item.id}</Text>
            </View>
            <Text style={styles.incidentText}>Fecha: {item.date}</Text>
            <Text style={styles.incidentText}>Descripción: {item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  incidentCard: {
    backgroundColor: "#eca622ff", // 🔹 fondo tipo rosa claro
    borderLeftWidth: 4,
    borderLeftColor: "#8b6615ff", // 🔹 borde rojo
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#331d08ff",
    marginLeft: 6,
  },
  incidentText: {
    fontSize: 16,
    marginBottom: 2,
  },
});
