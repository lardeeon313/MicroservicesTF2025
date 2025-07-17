import { useEffect,useState } from "react";
import { GetConfirmedOrdersService } from "../services/GetConfimedOrdersService";
import type { DepotOrderDTO } from "../types/OrderDTO";

export const useConfirmedOrders = () => {
    const [confirmedOrders,setConfirmedOrders] = useState<DepotOrderDTO[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchConfirmedOrders = async() => {
            setLoading(true);
            setError(null);
            try
            {
                const orders = await GetConfirmedOrdersService();
                setConfirmedOrders(orders);
            }
            catch(error:any)
            {
                setError(error);
                //setConfirmedOrders([]);

            }finally{
                setLoading(false);
            }
        }

        fetchConfirmedOrders();
    },[])

    return {confirmedOrders,loading,error}
}