import React from "react";
import type { RouteProp } from "@react-navigation/native";
import type { DepotStackParamList } from "../../types/DepotStackType";
import DetailOrderCard from "../../components/detail/DetailOrderCard";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { View, ActivityIndicator, Text } from "react-native";
import { useGetOneOrder } from "../../hocks/useGetOneOrder";
import { useAuth } from "../../../Login/context/useAuth"; // 👈 usamos auth real


type DetailOrderPageProps = RouteProp<DepotStackParamList, "DetailOrder">;
type Props = {
  route: DetailOrderPageProps;
};

const DetailOrderPage = ({ route }: Props) => {
  const { orderId, operatorUserId } = route.params;

  // 👇 traemos datos reales del contexto
  const { userId, name, role, isAuthenticated, logout } = useAuth();
  const user = userId && name && role ? { id: userId, name, role } : null;

  console.log("orderId:", orderId);
  console.log("operatorUserId (from route):", operatorUserId);
  console.log("operatorUserId (from auth):", user?.id);

  // 👉 acá podés usar el que te llega por params o el real del contexto
  const { order, loading, error } = useGetOneOrder(orderId, operatorUserId ?? user?.id ?? "");

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator 
        user={user} 
        isAuthenticated={isAuthenticated} 
        logout={logout} 
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={{ color: "red", padding: 16 }}>{error}</Text>}
      {order && user && (
        <DetailOrderCard 
          order={order} 
          operatorUserId={user.id} // 👈 ahora usa el id real del auth
        />
      )}
    </View>
  );
};

export default DetailOrderPage;
