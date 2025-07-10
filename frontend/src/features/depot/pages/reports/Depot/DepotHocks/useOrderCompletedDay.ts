
import { useEffect,useState } from "react";
import API from "../../../../../../api/axios";
import type { Order } from "../../../../../sales/types/OrderTypes";

type OrderCompleted = {
    OrderId: Order['id'];
    finishdate: Order['finishDate']
}

export const useOrderCompletedDay = (page: number, pageSize: number) => {
    const [data,setData] = useState<OrderCompleted[]>([]);
    const [loading,setLoading] = useState<boolean>(true);
    const [error,setError] = useState<string | null>(null);
    const [totalpages,setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try{
                //Cambiar la ruta de la api:
                const response = await API.get<OrderCompleted[]>("/orders", {
                    params: { page, pageSize },
                });

                const totalCount = Number(response.headers["x-total-count"]);
                    setTotalPages(Math.ceil(totalCount / pageSize));
                    setData(response.data);
                
            }catch(error){
                console.error("Error al obtener los pedidos completos. " , error);
                setError("No se pudieron obtener los datos.");
            }finally{
                setLoading(false);
            }
        }

        fetchData();
    },[page,pageSize] );

    return {data,loading,error,totalpages}
}