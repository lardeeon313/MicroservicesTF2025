import React,{useState} from "react";
import { RouteProp,useRoute } from "@react-navigation/native";
import type { DepotStackParamList } from "../../types/DepotStackType";
import AcceptOrder from "../../components/detail/AcceptOrder";
import { actualizarEstadoPedido } from "../../hocks/actions/updateStatusOrder";
import { showmeAcceptOrderAlert } from "../../components/additional/AlertWindows/AlertManager";
import { showmeRejectOrderAlert } from "../../components/additional/AlertWindows/AlertManager";
import type { Order } from "../../../otherTypes/OrderType";
import { OrderStatus } from "../../../otherTypes/OrderType";
import { View } from "react-native";
import NavbarOperator from "../../components/Navbar/NavbarOperator";

//EJEMPLO DE USO DEL NAVBAR: 
// Simulamos autenticación y usuario:
const user = { name: 'Juan Pérez', role: 'Operario' };
const isAuthenticated = true;



type AcceptOrderPageProp = RouteProp<DepotStackParamList,'AcceptOrder'>;

const AcceptOrderPage = () => {
    const {params} = useRoute<AcceptOrderPageProp>();
    const [order,setOrder] = useState<Order>(params.order);

    const handleAcceptOrder = () => {
        showmeAcceptOrderAlert(() => {
            const updatedOrder = {...order, status: OrderStatus.Confirmed};
            setOrder(updatedOrder);
            actualizarEstadoPedido(updatedOrder, 'aceptado');
        })
    };

    const handleRejectOrder = () => {
        showmeRejectOrderAlert(() => {
            actualizarEstadoPedido(order,'rechazado' );
        });
    };

    return(
        <View style={{flex:1}}>
            <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={() => console.log("Cerrar sesión")}/>
            <AcceptOrder
                order={order}
                onAccept={handleAcceptOrder}
                onReject={handleRejectOrder}
            />
        </View>
    )
}

export default AcceptOrderPage;