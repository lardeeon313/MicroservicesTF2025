import React,{useState} from "react";
import { useNavigation,useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DepotStackParamList } from "../../types/DepotStackType";
import ListOfMissingOrders from "../../components/listOrders/ListofMissingOrders";
import type { Missing } from "../../types/Missing";
import { OrderStatus } from "../../../otherTypes/OrderType";
import type { Order } from "../../../otherTypes/OrderType";
import createMockOrder from "../../mock/Mock";
import NotificationSectionPage from "../NotificationPages/NotificationSectionPage"; 
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { View , Text} from "react-native";

const user = { name: 'Juan Pérez', role: 'Operario' };
const isAuthenticated = true;

const ListofMissingOrdersPage = () => {
    const {params} = useRoute<RouteProp<DepotStackParamList, "MissingOrders">>();
    const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

    const [missingItems,setMissingItems] = useState<Missing[]>([]);

    const {
        id = 1,
        customer = "Sin cliente",
        status = "inPreparation",
        onVerDetalle = () => {},
        onEmitirFaltante = () => {},
        onMarcarArmado = () => {},
    } = params ?? {};

    //NUEVO: PARA CAMBIAR EL ESTADO DEL PEDIDO SI PRECIONA EL BOTON:
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.InPreparation)

    const HandleIssueMissing = () => {
        const newMissing: Missing = {
            id: missingItems.length + 1,
            product: {
                id: 101,
                orderId: id,
                productName: "Aceite de Girasol",
                productBrand: "Natura",
                quantity: 4,
                packaging: "Caja x12",
                unitPrice: 1300,
                total: 5200,
            },
            notifyMissing: (description: string) => ({
                missingDate: new Date(),
                missingTimeUtc: new Date(),
                description,
            }),
        }; 

        navigation.navigate("MissingReport", { missing: newMissing });

        //Acumula el contador: 
        setMissingItems((prev) => [...prev, newMissing]);
    }; 

    //MOck Order para ver el detalle


    const onSeeDetail = () => {
        navigation.navigate("DetailOrder", {order: createMockOrder(id)});
    }

    //para ir a la sección de notificaciones
    const onNotifySection = () => {
        navigation.navigate("NotificationPage", {order: createMockOrder(id)});
    }

    //NUEVO: 
    const UpdateOrderArmed = () => {
        if(orderStatus !== OrderStatus.InPreparation){
            setOrderStatus(OrderStatus.Prepared);
        }
    }


    //render 
    return(
        <View style={{flex:1}}>
            <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={() => console.log("Cerrar sesión")}/>
                <ListOfMissingOrders 
                id={id}
                customer={customer}
                status={status}
                missingCount={missingItems}
                onVerDetalle={() => onSeeDetail()}
                onEmitirFaltante={HandleIssueMissing}
                onMarcarArmado={UpdateOrderArmed}
                onSeccionNotificaciones={onNotifySection}
                />
        </View>
    )

}

export default ListofMissingOrdersPage;