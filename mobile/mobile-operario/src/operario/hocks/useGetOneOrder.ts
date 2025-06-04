import { useEffect,useState } from "react";
//services 
import { GetOrderById } from "../services/GetOneOrderService";
import type { Order } from "../../otherTypes/OrderType";

export const useGetOneOrder = (orderId: number) => {
    const [order,setOrder] = useState<Order | null>(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchOrder = async() => {
            setLoading(true);
            try{
                const fetchOrder = await GetOrderById(orderId);
                setOrder(fetchOrder);
                setError(null);
            }catch(error:any)
            {
                setError(error);
                setOrder(null);
            }finally
            {
                setLoading(false);
            }
        }; 

        if(orderId){
            fetchOrder();
        }
    }, [orderId]);

    return {order,loading,error};
}