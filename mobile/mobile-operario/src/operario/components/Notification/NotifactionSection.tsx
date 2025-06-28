import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import type { DepotOrderItemsReportedDto, DepotOrderMissingDTO } from "../../types/Missing";

type Props = {
    missingItems : DepotOrderMissingDTO[]
}

const NotificacionSection : React.FC<Props> = ({missingItems}) => {
    //Rendeizar cada elemento 
    return (
        <View style={{ padding: 16 }}> 
         <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            Notificaciones registradas: {missingItems.length} 
         </Text>
        <FlatList
            data={missingItems}
            keyExtractor={(item) => item.MissingId.toString()}
            renderItem={({ item }) => (
                <View style={{ padding: 12, backgroundColor: "#f9f9f9", borderRadius: 8, marginBottom: 12 }}>
                        <Text style={{ fontStyle: "italic", fontSize: 12, color: "#999" }}>
                            Fecha: {new Date(item.MissingDate).toLocaleDateString()}
                        </Text>

                        {item.MissingItems.map((product, index) => (
                            <View key={index} style={{ padding: 12, backgroundColor: "#f9f9f9", borderRadius: 8, marginTop: 8 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                                    {product.ProductName} - {product.ProductBrand}
                                </Text>
                                <Text style={{ color: "#555" }}>Cantidad: {product.Quantity}</Text>
                                <Text style={{ fontStyle: "italic", fontSize: 12, color: "#999" }}>
                                    {product.Packaging ? `Presentación: ${product.Packaging}` : "Sin presentación especificada"}
                                </Text>
                            </View>
                        ))}
                </View>
                )
            }
        />
    </View>
    )
}

export default NotificacionSection;