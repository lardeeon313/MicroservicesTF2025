import { useEffect,useState } from "react";
import { GetMissingOrdersService } from "../services/GetMissingOrdersService";
import type { DepotOrderDTO } from "../types/OrderDTO";

export const useMissingOrders = () => {
    const [missingOrders,setMissingOrders] = useState<DepotOrderDTO[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchArmOrders = async() => {
            setLoading(true);
            setError(null);
            try
            {
                const data = await GetMissingOrdersService();
                setMissingOrders(data);
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