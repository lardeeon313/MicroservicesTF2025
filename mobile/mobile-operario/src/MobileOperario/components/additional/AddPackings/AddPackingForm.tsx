import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAddPackagings } from "../../../hocks/useAddPackings";
import type { AddPackingCommand } from "../../../types/AddPackings";
import { DepotOrderStatus } from "../../../types/OrderDTO";
import { AlertCircle } from "lucide-react-native";

type Props = {
  depotOrderItemId: number;
  onSuccess?: () => void;
  pedidoStatus: DepotOrderStatus;
  onPackagingChange: (packaging: string) => void;
};

const AddPackingForm: React.FC<Props> = ({
  depotOrderItemId,
  onSuccess,
  pedidoStatus,
  onPackagingChange,
}) => {
  const [packagingType, setPackagingType] = useState("");
  const [showPreparedModal, setShowPreparedModal] = useState(false);

  const { addPackagings, loading, error, success } = useAddPackagings();

  const isDisabled = [
    DepotOrderStatus.Assigned,
    DepotOrderStatus.MissingProduct,
    DepotOrderStatus.SentToBilling,
  ].includes(pedidoStatus);

  let disabledMessage: string | null = null;

  if (pedidoStatus === DepotOrderStatus.SentToBilling) {
    disabledMessage =
      "Este pedido ya fue facturado. No se pueden realizar más acciones.";
  } else if (
    pedidoStatus === DepotOrderStatus.Assigned ||
    pedidoStatus === DepotOrderStatus.MissingProduct
  ) {
    disabledMessage =
      "Para realizar acciones, primero se deben resolver los productos faltantes o confirmar el pedido.";
  }

  const handleSubmit = async () => {
    // 🚫 Estado PREPARED → bloqueo con modal
    if (pedidoStatus === DepotOrderStatus.Prepared) {
      setShowPreparedModal(true);
      return;
    }

    if (!packagingType.trim()) {
      Alert.alert("Error", "El tipo de empaque no puede estar vacío.");
      return;
    }

    const payload: AddPackingCommand = {
      packagingItems: [
        {
          depotOrderItemId,
          packagingType: packagingType.trim(),
        },
      ],
    };

    await addPackagings(payload);

    if (!error) {
      onPackagingChange(packagingType.trim());
      setPackagingType("");

      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <View
      style={{
        marginTop: 10,
        padding: 10,
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
      }}
    >
      <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
        Agregar tipo de empaque:
      </Text>

      <TextInput
        style={[
          {
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 8,
            borderRadius: 4,
            marginBottom: 10,
          },
          { backgroundColor: isDisabled ? "#eee" : "#fff" },
        ]}
        placeholder="Ej: Caja, Bolsa, Enlatado..."
        value={packagingType}
        onChangeText={setPackagingType}
        editable={!isDisabled}
      />

      {isDisabled && disabledMessage && (
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <AlertCircle
            color={
              pedidoStatus === DepotOrderStatus.SentToBilling ? "green" : "red"
            }
            size={18}
            style={{ marginBottom: 6 }}
          />
          <Text
            style={{
              color:
                pedidoStatus === DepotOrderStatus.SentToBilling
                  ? "green"
                  : "red",
              textAlign: "center",
            }}
          >
            {disabledMessage}
          </Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="small" color="#007bff" />
      ) : (
        <Button
          title="Agregar empaque"
          onPress={handleSubmit}
          disabled={isDisabled}
        />
      )}

      {error && (
        <Text style={{ color: "red", marginTop: 6 }}>
          Error: {error.message}
        </Text>
      )}

      {success && (
        <Text style={{ color: "green", marginTop: 6 }}>
          ✅ Empaque agregado con éxito
        </Text>
      )}

      {/* 🔒 MODAL: pedido PREPARED */}
      {showPreparedModal && (
        <View
          style={{
            position: "absolute",
            inset: 0,
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
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Acción no permitida
            </Text>
            <Text style={{ marginBottom: 20 }}>
              No se puede agregar embalaje cuando el pedido ya se encuentra en
              estado PREPARADO.
            </Text>
            <Button
              title="Entendido"
              onPress={() => setShowPreparedModal(false)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default AddPackingForm;
