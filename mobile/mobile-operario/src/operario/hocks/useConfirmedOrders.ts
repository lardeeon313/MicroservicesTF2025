import { useEffect,useState } from "react";
import { GetConfirmedOrdersService } from "../services/GetConfimedOrdersService";
import type { Order } from "../../otherTypes/OrderType";

export const useConfirmedOrders = () => {
    const [confirmedOrders,setConfirmedOrders] = useState<Order[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchConfirmedOrders = async() => {
            setLoading(true);
            try
            {
                const data = await GetConfirmedOrdersService();
                setConfirmedOrders(data);
                setError(null);
            }
            catch(error: any)
            {
                setError(error);
                setConfirmedOrders([]);

            }finally{
                setLoading(false);
            }
        }

        fetchConfirmedOrders();
    },[])

    return {confirmedOrders,loading,error}
}