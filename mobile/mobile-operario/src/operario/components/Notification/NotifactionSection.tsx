import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import type { Missing } from "../../types/Missing";

type Props = {
    missingItems : Missing[];
}

const NotificacionSection : React.FC<Props> = ({missingItems}) => {
    //Rendeizar cada elemento 
    return (
        <View style={{ padding: 16 }}> 
         <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            Notificaciones resgitradas: {missingItems.length} 
         </Text>
        <FlatList
            data={missingItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
                const { product, notifyMissing } = item;
                const { description, missingDate } = notifyMissing("Descripción registrada");
            return (
            <View style={{padding: 12,backgroundColor: "#f9f9f9",borderRadius: 8,marginBottom: 10,}}>
              <Text style={{fontWeight: "bold", fontSize: 16}}>{product.productName}</Text>
              <Text style={{ color: "#555" }}>{description}</Text>
              <Text style={{fontStyle: "italic", fontSize: 12, color: "#999"}}>
                Fecha: {new Date(missingDate).toLocaleDateString()}
              </Text>
            </View>
                );
            }}
        />
    </View>
    )
}

export default NotificacionSection;