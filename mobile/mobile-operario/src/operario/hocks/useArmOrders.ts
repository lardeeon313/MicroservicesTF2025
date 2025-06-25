import { useEffect,useState } from "react";
import { GetArmOrdersService } from "../services/GetArmOrdersService";
//import type { Order } from "../../otherTypes/OrderType";
import type { DepotOrderDTO } from "../types/OrderDTO";

export const useArmOrders = () => {
    const [armOrders,setArmOrders] = useState<DepotOrderDTO[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchArmOrders = async () => {
            setLoading(true);
            setError(null);
            try
            {
                const data = await GetArmOrdersService();
                setArmOrders(data);
            }
            catch (error: any)
            {
                setError(error);
                setArmOrders([]);
            }
            finally
            {
                setLoading(false);
            }
        }; 
        fetchArmOrders();
    }, []);

    return {armOrders,loading,error};
}