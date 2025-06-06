import React from "react";
import { useOrderCompletedDay } from "../DepotHocks/useOrderCompletedDay";
import OrderCompletedDayTable from "../DepotComponents/OrderCompletedDayTable";

const OrderCompletedDayPage: React.FC = () => {
    const {data,loading,error} = useOrderCompletedDay();

    if(loading) return <div className="p-4">Cargando...</div>
    if(error) return <div className="p-4 text-red-500">{error}</div>

    return(
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                Pedidos completados por dia
            </h2>
            <OrderCompletedDayTable data={data} />
        </div>
    )
}

export default OrderCompletedDayPage;