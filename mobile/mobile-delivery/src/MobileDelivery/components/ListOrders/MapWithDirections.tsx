import React, { useMemo } from "react";
import { View, StyleSheet, Platform } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { LogisticOrder } from "../../types/DeliveryOrderTypeDto";

type Props = {
  orders: LogisticOrder[];
};

export default function MapWithDirections({ orders }: Props) {
  const initialRegion: Region = useMemo(() => {
    if (orders.length === 0) {
      return {
        latitude: -31.4201,
        longitude: -64.1888,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    const avgLat =
      orders.reduce(
        (sum, o) => sum + (o.deliveryAddress.latitude || 0),
        0
      ) / orders.length;
    const avgLng =
      orders.reduce(
        (sum, o) => sum + (o.deliveryAddress.longitude || 0),
        0
      ) / orders.length;

    return {
      latitude: avgLat,
      longitude: avgLng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [orders]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.backgroundFix} />
      <MapView
        key={Platform.OS === "android" ? Math.random().toString() : "map"} // fuerza rerender limpio
        style={styles.map}
        initialRegion={initialRegion}
        mapType="standard"
        showsBuildings={false}
        moveOnMarkerPress={false}
        toolbarEnabled={false}
        pitchEnabled
        rotateEnabled
        zoomEnabled
        scrollEnabled
      >
        {orders.map((order) => {
          const { deliveryAddress, customer } = order;
          if (!deliveryAddress.latitude || !deliveryAddress.longitude) return null;

          return (
            <Marker
              key={order.id}
              coordinate={{
                latitude: deliveryAddress.latitude,
                longitude: deliveryAddress.longitude,
              }}
              title={`${customer.firstName} ${customer.lastName}`}
              description={`${deliveryAddress.street} ${deliveryAddress.number}, ${deliveryAddress.city}`}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  backgroundFix: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff", // evita que se vea el mapa anterior
    zIndex: -1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
