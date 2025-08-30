import { useEffect,useState } from "react";
import { GetMissingOrdersService } from "../services/GetMissingOrdersService";
import type { DepotOrderDTO } from "../types/OrderDTO";

export const useMissingOrders = (operatorUserId:string) => {
    const [missingOrders,setMissingOrders] = useState<DepotOrderDTO[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchArmOrders = async() => {
            setLoading(true);
            setError(null);
            try
            {
                const data = await GetMissingOrdersService(operatorUserId);
                console.log('Pedidos con faltantes recibidos:', data);
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
        //
        if (operatorUserId) {
            fetchArmOrders();
        }
        fetchArmOrders();
    }, [operatorUserId]); 

    return {missingOrders,loading,error}
}