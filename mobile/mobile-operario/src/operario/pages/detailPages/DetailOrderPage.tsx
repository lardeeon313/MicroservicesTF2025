import React from "react";
import type { RouteProp} from "@react-navigation/native";
import type { DepotStackParamList } from "../../types/DepotStackType";
import DetailOrderCard from "../../components/detail/DetailOrderCard";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { View, ActivityIndicator, Text } from "react-native";
import { useGetOneOrder } from "../../hocks/useGetOneOrder";

const user = { name: "Juan Pérez", role: "Operario", id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa" };
const isAuthenticated = true;

type DetailOrderPageProps = RouteProp<DepotStackParamList, "DetailOrder">;
type Props = {
  route: DetailOrderPageProps;
};

const DetailOrderPage = ({ route }: Props) => {
  const { orderId,operatorUserId} = route.params;
  //const {user} = useAuth();
  //const {orderId} = route.params;

  //if (!user) return <Text style={{ padding: 16 }}>Cargando usuario...</Text>;

  //const operatorUserId = user.id;

  console.log("orderId:", orderId);
  console.log("operatorUserId:", user?.id);

  const { order, loading, error } = useGetOneOrder(orderId,operatorUserId);

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={() => console.log("Cerrar sesión")} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={{ color: "red", padding: 16 }}>{error}</Text>}
      {order && <DetailOrderCard order={order} operatorUserId={user.id} />}
    </View>
  );
};

export default DetailOrderPage;