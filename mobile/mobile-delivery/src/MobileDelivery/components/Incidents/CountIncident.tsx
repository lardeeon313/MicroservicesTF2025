import React from "react";
import { View, Text } from "react-native";

type Props = {
  count: number;
};

export default function CountIncident({ count }: Props) {
  return (
    <View style={{backgroundColor: "#fff",borderRadius: 8,padding: 10,marginTop: 8,shadowColor: "#000",elevation: 2,}}>
      <Text style={{fontSize: 14,fontWeight: "600",color: "#333",}}>
        Total de reportes de incidentes: {count}
      </Text>
    </View>
  );
}
