import { useEffect,useState } from "react";
import { GetOrderById } from "../services/GetOneOrderService";
import type { DepotOrderDTO } from "../types/OrderDTO";

export const useGetOneOrder = (orderId: number | null, userId: string | null) => {
    const [order,setOrder] = useState<DepotOrderDTO | null>(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId || !userId) {
            setLoading(false);
            return;
        }

        const fetchOrder = async() => {
            setLoading(true);
            setError(null);
            try {
                const result = await GetOrderById(orderId, userId);
                setOrder(result);
            } catch(err:any) {
                setError(err.message || "Error al obtener el pedido");
                setOrder(null);
            } finally {
                setLoading(false);
            }
        }; 

        fetchOrder();
    }, [orderId, userId]);

    return {order, loading, error};
}