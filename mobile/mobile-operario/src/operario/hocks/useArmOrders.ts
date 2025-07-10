import { useEffect,useState } from "react";
import { GetArmOrdersService } from "../services/GetArmOrdersService";
import type { DepotOrderDTO } from "../types/OrderDTO";

export const useArmOrders = (operatorUserId: string) => {
    const [armOrders,setArmOrders] = useState<DepotOrderDTO[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchArmOrders = async () => {
            setLoading(true);
            setError(null);
            try
            {
                const data = await GetArmOrdersService(operatorUserId);
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
    }, [operatorUserId]);

    return {armOrders,loading,error};
}