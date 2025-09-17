import { useEffect,useState } from "react";
import { GetPreparedOrdersService } from "../services/GetPreparedOrdersService";
import type { DepotOrderDTO } from "../types/OrderDTO";
import { OrderStatusMap } from "../types/OrderDTO";

export const usePreparedOrders = (operatorUserId:string) => {
    const [preparedOrders,setPreparedOrders] = useState<DepotOrderDTO[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchPreparedOrders = async() => {
            setLoading(true);
            setError(null);
            try
            {
                const data = await  GetPreparedOrdersService(operatorUserId);
                
                setPreparedOrders(
                      data.map(order => ({
                    ...order,
                    status: OrderStatusMap[order.status]
                }))
                );
            }
            catch(err: any)
            {
                setError(err);
                setPreparedOrders([]);
            }
            finally
            {
                setLoading(false);
            }
        };
        fetchPreparedOrders();
    },[operatorUserId]);

    return {preparedOrders,loading,error}
}