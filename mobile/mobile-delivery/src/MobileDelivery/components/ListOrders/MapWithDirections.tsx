import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { DeliveryOrderTypeDto } from "../../types/DeliveryOrderTypeDto";

type Props = {
  orders: DeliveryOrderTypeDto[];
};

export default function MapWithDirections({ orders }: Props) {
  // 🧠 Calcula el centro dinámico
  const initialRegion: Region = useMemo(() => {
    if (orders.length === 0) {
      return {
        latitude: -31.4201, // fallback: centro de Córdoba
        longitude: -64.1888,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    const avgLat =
      orders.reduce((sum, o) => sum + o.location.lat, 0) / orders.length;
    const avgLng =
      orders.reduce((sum, o) => sum + o.location.lng, 0) / orders.length;

    return {
      latitude: avgLat,
      longitude: avgLng,
      latitudeDelta: 0.05, // zoom ajustado a ciudad
      longitudeDelta: 0.05,
    };
  }, [orders]);

  return (
    <View style={styles.mapContainer}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {orders.map((order) => (
          <Marker
            key={order.id}
            coordinate={{
              latitude: order.location.lat,
              longitude: order.location.lng,
            }}
            title={order.customer}
            description={order.address}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  map: {
    height: 200,
    width: "100%",
  },
});
