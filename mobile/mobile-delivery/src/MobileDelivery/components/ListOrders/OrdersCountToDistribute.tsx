import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  confirmedOrders: number; // número de confirmaciones
  onThresholdReached: (canShow: boolean) => void; // callback para habilitar o no el modal
};

export default function OrdersCountToDistribute({ confirmedOrders, onThresholdReached }: Props) {
  useEffect(() => {
    // si hay 3 o más confirmaciones, habilita el modal
    if (confirmedOrders >= 3) {
      onThresholdReached(true);
    } else {
      // si hay menos de 3, el modal no debería mostrarse
      onThresholdReached(false);
    }
  }, [confirmedOrders]);

  return (
    <View 
    style={{
        width: 100,          
        height: 60,         
        backgroundColor: "#bd1d1dff",
        borderRadius: 12,    
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        elevation: 4,        
        shadowColor: "#000", 
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    }}>
      <Text style={{fontSize: 8,color: "#fff",marginTop: 6,textAlign: "center",fontWeight:'bold'}}>Pedidos confirmados:</Text>
      <Text style={{fontSize: 20,fontWeight: "bold",color: "#fff",}}>{confirmedOrders}</Text>

    </View>
  );
}

