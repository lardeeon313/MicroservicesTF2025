import { useEffect,useState } from "react";
import { GetMissingOrdersService } from "../services/GetMissingOrdersService";
import type { Order } from "../../otherTypes/OrderType";

export const useMissingOrders = () => {
    const [missingOrders,setMissingOrders] = useState<Order[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchArmOrders = async() => {
            setLoading(true);
            try
            {
                const data = await GetMissingOrdersService();
                setMissingOrders(data);
                setError(null);
            }
            catch(error:any)
            {
                setError(error);
                setMissingOrders([]);
            }
            finally
            {
                setLoading(false);
            }
        };
        fetchArmOrders();
    }, []); 

    return {missingOrders,loading,error}
}