//Hock para trear todos los pedido asignados.
import {useEffect,useState } from "react";
import type { Order } from "../../../sales/types/OrderTypes";
import { GetOrders } from "../services/GetOrdersService";

export const useOrderList = () => {
    const [orders,setOrders] = useState<Order[]>([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async() => {
            try{
                const data= await GetOrders();
                setOrders(data);

            }catch(error){
                console.error("Error al obtener los datos," ,error)

            }finally{
                setLoading(false)
            }
        }

        fetchOrders();
    }, [])

    return {orders,loading};
}