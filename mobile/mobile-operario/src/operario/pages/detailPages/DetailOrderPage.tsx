import { useEffect,useState } from "react";
import DetailOrderCard from "../../components/detail/DetailOrderCard";
import type { RouteProp } from "@react-navigation/native";
import type { DepotStackParamList} from "../../types/DepotStackType";
import  type { Order } from "../../../otherTypes/OrderType";
import { OrderStatus } from "../../../otherTypes/OrderType";
//------
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { View } from "react-native";

//EJEMPLO DE USO DEL NAVBAR: 
// Simulamos autenticación y usuario:
const user = { name: 'Juan Pérez', role: 'Operario' };
const isAuthenticated = true;


type DetailOrderPageProps = RouteProp<DepotStackParamList, "DetailOrder">;

type Props = {
    route: DetailOrderPageProps;
}

const ListOfConfirmedOrdes: number[] = [101, 102, 103];

const DetailOrderPage = ({ route }: Props) => {
    const [order,setOrder] = useState<Order>(route.params.order);

    useEffect(() => {
        const isConfirmed = ListOfConfirmedOrdes.includes(order.id)

        //Verifica si el pedido es confirmado para cambiar el estado 
        if(isConfirmed && order.status === OrderStatus.InPreparation){
            const updateOrder: Order = {
                ...order,
                status: OrderStatus.Prepared,

            }
            setOrder(updateOrder);
        }
    }, [order]);

    return (
        <View style={{flex:1}}>
            <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={() => console.log("Cerrar sesión")} />
            <DetailOrderCard 
                order={order}
            />
        </View>
    );
}

export default DetailOrderPage;