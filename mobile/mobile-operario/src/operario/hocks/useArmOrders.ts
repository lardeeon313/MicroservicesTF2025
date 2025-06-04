import { useEffect,useState } from "react";
import { GetArmOrdersService } from "../services/GetArmOrdersService";
import type { Order } from "../../otherTypes/OrderType";

export const useArmOrders = () => {
    const [armOrders,setArmOrders] = useState<Order[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchArmOrders = async () => {
            setLoading(true);
            try
            {
                const data = await GetArmOrdersService();
                setArmOrders(data);
                setError(null);
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