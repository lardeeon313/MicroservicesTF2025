import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import CountIncident from "../Incidents/CountIncident";

type Props = {
  id: number;
  customer: string;
  address: string;
  status: string;
  priority: string;
  incidentCount: number;
  onSeeDetail: () => void;
  onReportIncident: () => void;
  onViewIncidents: () => void;
};

export default function ListOrdersToIncidentComponent({
  id,
  customer,
  address,
  status,
  priority,
  incidentCount,
  onSeeDetail,
  onReportIncident,
  onViewIncidents,
}: Props) {
  return (
    <View style={{backgroundColor: '#fff',padding: 16,borderRadius: 12,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,elevation: 2,marginBottom: 16}}>
      {/* Pedido e info */}
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Pedido # : {id}
      </Text>
      <Text style={{ fontSize: 20, fontWeight: '300', marginTop: 4 }}>
        Cliente: {customer}
      </Text>
      <Text style={{ fontSize: 20, fontWeight: '300', marginTop: 4 }}>
        Dirección: {address}
      </Text>

      {/* Botones */}
      <View style={{flexDirection: 'row', gap: 10, marginTop: 16}}>
        <TouchableOpacity
          style={{
            backgroundColor: "#3B82F6",
            padding: 8,
            borderRadius: 8,
          }}
          onPress={onSeeDetail}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Ver Detalle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#EF4444",
            padding: 8,
            borderRadius: 8,
          }}
          onPress={onReportIncident}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Reportar Incidente
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
        <TouchableOpacity style={{backgroundColor: "#eb074bff",paddingVertical: 8,paddingHorizontal: 12,borderRadius: 6,marginTop: 8,}}
        onPress={onViewIncidents} // 👉 abre incidencias
        >
        <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
         ATENCIÓN: Revisar incidentes del pedido
        </Text>
      </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 20, color: '#6B7280', marginTop: 8 }}>
        Estado: {status}
      </Text>

      {/* Contador */}
      <CountIncident count={incidentCount} />
    </View>
  );
}
