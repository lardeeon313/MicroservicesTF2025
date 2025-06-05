//Para gestionar la logica de negocio de todo el listado de pedidos que le llegan al operario
import React from "react";
import { useOrderList } from "../hocks/useOrderList";
import OrderListScreen from "../screens/OrderListScreen";

const OrderListPage  = () => {
    const {orders, loading} = useOrderList();

    //Le pasa data al screen: 
    return <OrderListScreen Orders={orders} loading={loading} />
}

export default OrderListPage;