import React, { useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { MarkItemIsReady, UnMarkItemIsReady } from "../../../services/PostAddPackings";
import type { MarkItemCommand, UnMarkItemReadyCommand } from "../../../types/AddPackings";
import AddPackingForm from "../AddPackings/AddPackingForm";
import { DepotOrderStatus } from "../../../types/OrderDTO";
import AllProductsMarkedModal from "./AllProductsMarkedModal";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DepotStackParamList } from "../../../types/DepotStackType";

type OrderItem = {
  id: number;
  nombre: string;
  marca: string;
  marcado: boolean;
  embalaje: string;
  cantidad: number;
};

type Props = {
  operatorUserId: string;
  pedidoItems: OrderItem[];
  pedidoStatus: DepotOrderStatus;
};

const ItemOrdersComponent: React.FC<Props> = ({
  operatorUserId,
  pedidoItems,
  pedidoStatus,
}) => {
  const [items, setItems] = useState<OrderItem[]>(pedidoItems);
  const [showAllMarkedModal, setShowAllMarkedModal] = useState(false);
  const [showNoPackingModal, setShowNoPackingModal] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

  const isDisabled = [
    DepotOrderStatus.Assigned,
    DepotOrderStatus.MissingProduct,
    DepotOrderStatus.SentToBilling,
  ].includes(pedidoStatus);

  const handleMarkToggle = async (item: OrderItem) => {
    try {
      // 🚫 BLOQUEO REAL: no hay embalaje
      if (
        !item.marcado &&
        (!item.embalaje || item.embalaje.trim().length === 0)
      ) {
        setShowNoPackingModal(true);
        return;
      }

      if (item.marcado) {
        const data: UnMarkItemReadyCommand = { orderItemId: item.id };
        await UnMarkItemIsReady(data);
      } else {
        const data: MarkItemCommand = {
          orderItemId: item.id,
          operatorUserId,
        };
        await MarkItemIsReady(data);
      }

      const updatedItems = items.map((i) =>
        i.id === item.id ? { ...i, marcado: !i.marcado } : i
      );

      setItems(updatedItems);

      if (updatedItems.every((i) => i.marcado)) {
        setShowAllMarkedModal(true);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al actualizar ítem");
    }
  };

  return (
    <View style={{ flex: 1, padding: 2, borderRadius: 12 }}>
      {pedidoStatus === DepotOrderStatus.Prepared && (
        <View
          style={{
            backgroundColor: "#332f2c",
            padding: 10,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#efefef",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            ¿Necesitas volver a mandar el pedido a preparación? Desmarca todos los
            productos del pedido para hacerlo.
          </Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: item.marcado ? "#d4edda" : "#fff",
              padding: 16,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: "#ccc",
              marginBottom: 12,
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>
              Producto: {item.nombre}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>
              Marca: {item.marca}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "gray",
                fontWeight: "500",
                marginBottom: 2,
              }}
            >
              Embalaje: {item.embalaje || "—"}
            </Text>
            <Text style={{ fontSize: 14, color: "#555" }}>
              Cantidad: {item.cantidad}
            </Text>

            <AddPackingForm
              depotOrderItemId={item.id}
              pedidoStatus={pedidoStatus}
            />

            <Button
              title={item.marcado ? "❌ Desmarcar" : "✅ Marcar como listo"}
              color={item.marcado ? "red" : "green"}
              onPress={() => handleMarkToggle(item)}
              disabled={isDisabled}
            />
          </View>
        )}
      />

      {/* MODAL: TODOS MARCADOS */}
      <AllProductsMarkedModal
        visible={showAllMarkedModal}
        onClose={() => setShowAllMarkedModal(false)}
        onAccept={() => {
          setShowAllMarkedModal(false);
          navigation.navigate("OperatorDashboard");
        }}
      />

      {/* MODAL: FALTA EMBALAJE */}
      {showNoPackingModal && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 12,
              width: "85%",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
              Embalaje requerido
            </Text>

            <Text style={{ marginBottom: 20 }}>
              Debes introducir el embalaje antes de marcar el producto como listo.
            </Text>

            <Button
              title="Entendido"
              onPress={() => setShowNoPackingModal(false)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ItemOrdersComponent;