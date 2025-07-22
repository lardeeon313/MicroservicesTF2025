import React from 'react';
import { Order } from "../../../sales/types/OrderTypes";

interface Props {
    orders: Order[],
    loading: boolean,
}

const OrderListComponent: React.FC<Props> = ({orders, loading}) => {
    
    const renderItem = (item: Order) => (
        <div key={item.id} className="p-4 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-gray-50">
            <p className="font-medium">Cliente: {item.customerFirstName} {item.customerLastName}</p>
            <p className="text-sm text-gray-600">Direccion: {item.deliveryDetail}</p>
            <p className="text-sm text-gray-600">Estado: {item.status}</p>
            <p className="text-sm text-gray-600">Fecha del pedido: {item.orderDate}</p>
        </div>
    ); 

    if(loading){
        return(
            <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Cargando pedidos....</p>
            </div>
        )
    }
    
    return(
        <div className="space-y-2">
            {orders.map(renderItem)}
        </div>
    )
}

export default OrderListComponent;