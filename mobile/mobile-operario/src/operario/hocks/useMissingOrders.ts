import { useEffect,useState } from "react";
import { GetMissingOrdersService } from "../services/GetMissingOrdersService";
import type { DepotOrderDTO } from "../types/OrderDTO";

export const useMissingOrders = (operatorUserId:string) => {
    const [missingOrders,setMissingOrders] = useState<DepotOrderDTO[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchMissingOrders = async() => {
            if (!operatorUserId) {
                setError(new Error('ID de operador no válido'));
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const data = await GetMissingOrdersService(operatorUserId);
                setMissingOrders(data);
            } catch(error:any) {
                setError(error);
                setMissingOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMissingOrders();
    }, [operatorUserId]); 

    return {missingOrders,loading,error}
}