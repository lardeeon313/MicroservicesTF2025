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
import { mockOrders } from "../../mock/MockOrders";

//
import { DepotOrderDTO } from "../../types/OrderDTO"; 


const user = { name: 'Juan Pérez', role: 'Operario' , id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa'};
const isAuthenticated = true;

const ListofMissingOrdersPage = () => {
    const {params} = useRoute<RouteProp<DepotStackParamList, "MissingOrders">>();
    const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

    const [missingItems,setMissingItems] = useState<Missing[]>([]);

    const mockOrderInPrep = mockOrders.find((order) => order.status === OrderStatus.InPreparation );
    if (!mockOrderInPrep) throw new Error("No se encontró el pedido en preparación");

    const {
        id = mockOrderInPrep.id,
        customer = `${mockOrderInPrep.customer?.firstName} ${mockOrderInPrep.customer?.lastName}`,
        status = mockOrderInPrep.status,
        onVerDetalle = () => {},
        onEmitirFaltante = () => {},
        onMarcarArmado = () => {},
    } = params ?? {};

    //NUEVO: PARA CAMBIAR EL ESTADO DEL PEDIDO SI PRECIONA EL BOTON:
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.InPreparation)

    const HandleIssueMissing = () => {
        const newMissing: Missing = {
            id: missingItems.length + 1,
            product: mockOrderInPrep.items[0],
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


    const onSeeDetail = (order: DepotOrderDTO) => {
        navigation.navigate("DetailOrder",{
            orderId: order.depotOrderId,
            operatorUserId: user.id
        });
    }

    //para ir a la sección de notificaciones
    const onNotifySection = () => {
        navigation.navigate("NotificationPage", {
            order: mockOrderInPrep
        });
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
                customer={`${mockOrderInPrep.customer?.firstName} ${mockOrderInPrep.customer?.lastName}`}
                status={status}
                missingCount={missingItems}
                onVerDetalle={() => onSeeDetail(order)}
                onEmitirFaltante={HandleIssueMissing}
                onMarcarArmado={UpdateOrderArmed}
                onSeccionNotificaciones={onNotifySection}
                />
        </View>
    )

}

export default ListofMissingOrdersPage;
/*import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DepotStackParamList } from "../../types/DepotStackType";
import ListOfMissingOrders from "../../components/listOrders/ListofMissingOrders";
import { DepotOrderStatus } from "../../types/OrderDTO";
import type { DepotOrderDTO } from "../../types/OrderDTO";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import { View, Text, TextInput, Modal, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
//import { useReportOrderMissing } from "../../hooks/useReportOrderMissing"; // Asegurate de que esté bien la ruta
import { useReportOrderMissing } from "../../hocks/useReportOneMissing";

const user = {
  name: "Juan Pérez",
  role: "Operario",
  id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
};
const isAuthenticated = true;

const ListofMissingOrdersPage = () => {
  const { params } = useRoute<RouteProp<DepotStackParamList, "MissingOrders">>();
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

  const [showMissingModal, setShowMissingModal] = useState(false);
  const [missingReason, setMissingReason] = useState("");
  const [missingDescription, setMissingDescription] = useState("");
  const [orderStatus, setOrderStatus] = useState<DepotOrderStatus>(DepotOrderStatus.InPreparation);

  const { reportMissing, loading, success, error } = useReportOrderMissing();

  const order: DepotOrderDTO = params?.id;
  if (!order) throw new Error("No se encontró el pedido en preparación");

  const enviarFaltante = async () => {
    if (!missingReason || !missingDescription) {
      Alert.alert("Faltan datos", "Completá el motivo y la descripción del faltante.");
      return;
    }

    const body = {
      DepotOrderId: order.depotOrderId,
      MissingReason: missingReason,
      MissingDescription: missingDescription,
      MissingItems: order.items.map((item) => ({
        OrderItemId: item.id,
        ProductName: item.productName,
        ProductBrand: item.productBrand,
        Packaning: item.packagingType,
        Quantity: item.quantity,
      })),
    };

    try {
      await reportMissing(body);
      Alert.alert("Éxito", "Faltante reportado correctamente.");
      setShowMissingModal(false);
      setMissingReason("");
      setMissingDescription("");
    } catch (err) {
      Alert.alert("Error", "No se pudo enviar el faltante.");
      console.error(err);
    }
  };

  const onSeeDetail = (order: DepotOrderDTO) => {
    navigation.navigate("DetailOrder", {
      orderId: order.depotOrderId,
      operatorUserId: user.id,
    });
  };

  const onNotifySection = () => {
    navigation.navigate("NotificationPage", { order });
  };

  const UpdateOrderArmed = () => {
    if (orderStatus !== DepotOrderStatus.Prepared) {
      setOrderStatus(DepotOrderStatus.Prepared);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <NavbarOperator
        user={user}
        isAuthenticated={isAuthenticated}
        logout={() => console.log("Cerrar sesión")}
      />

      <ListOfMissingOrders
        id={order.depotOrderId}
        customer={order.customerName}
        status={order.status}
        missingCount={[]} // si no lo usás, lo podés eliminar
        onVerDetalle={() => onSeeDetail(order)}
        onEmitirFaltante={() => setShowMissingModal(true)}
        onMarcarArmado={UpdateOrderArmed}
        onSeccionNotificaciones={onNotifySection}
      />

      <Modal visible={showMissingModal} animationType="slide" transparent={true}>
        <View style={{flex: 1,backgroundColor: "rgba(0,0,0,0.4)",justifyContent: "center",alignItems: "center",}}>
          <View style={{backgroundColor: "#fff",borderRadius: 10,padding: 20,width: "85%",}}>
            <Text style={{fontSize: 18,marginBottom: 10,fontWeight: "bold"}}>Reportar Faltante</Text>

            <TextInput
              placeholder="Motivo"
              value={missingReason}
              onChangeText={setMissingReason}
              style={{borderWidth: 1,borderColor: "#ccc",padding: 10,marginVertical: 5,borderRadius: 5}}
            />
            <TextInput
              placeholder="Descripción"
              value={missingDescription}
              onChangeText={setMissingDescription}
              style={[{borderWidth: 1,borderColor: "#ccc",padding: 10,marginVertical: 5,borderRadius: 5}, { height: 80 }]}
              multiline
            />

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View style={{flexDirection: "row",justifyContent: "space-between",marginTop: 15}}>
                <Button title="Cancelar" onPress={() => setShowMissingModal(false)} />
                <Button title="Enviar" onPress={enviarFaltante} />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListofMissingOrdersPage;*/
