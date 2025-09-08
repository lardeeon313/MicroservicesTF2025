import React from "react";
import type { RouteProp} from "@react-navigation/native";
import type { DepotStackParamList } from "../../types/DepotStackType";
import DetailOrderCard from "../../components/detail/DetailOrderCard";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { View, ActivityIndicator, Text } from "react-native";
import { useGetOneOrder } from "../../hocks/useGetOneOrder";
import { useAuth } from "../../../Login/context/useAuth";

type DetailOrderPageProps = RouteProp<DepotStackParamList, "DetailOrder">;
type Props = {
  route: DetailOrderPageProps;
};

export default function DetailOrderPage({ route }: Props) {
  const { userId, name, role } = useAuth();
  const { orderId, operatorUserId } = route.params;

  // Validar que userId no sea null
  if (!userId) {
    return <Text style={{ padding: 16, color: 'red' }}>Usuario no autenticado</Text>;
  }

  const { order, loading, error } = useGetOneOrder(orderId, userId);

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator 
        user={{ name: name || 'Operario', role: role || 'Operario' }} 
        isAuthenticated={true} 
        logout={() => console.log("Cerrar sesión")} 
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={{ color: "red", padding: 16 }}>{error}</Text>}
      {order && <DetailOrderCard order={order} operatorUserId={userId} />}
    </View>
  );
}