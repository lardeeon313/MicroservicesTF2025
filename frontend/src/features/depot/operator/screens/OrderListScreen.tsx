import React from "react";
import OrderListComponent from "../components/OrderList";
import { Order } from "../../../sales/types/OrderTypes";

interface Props {
    Orders: Order[],
    loading: boolean,
}

const OrderListScreen = ({Orders,loading} :Props) => {
    return <OrderListComponent orders={Orders} loading={loading} />
}

export default OrderListScreen;