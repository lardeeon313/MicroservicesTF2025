import { useState,useEffect } from "react";
import { OrderStatus, type Order } from "../../../../../sales/types/OrderTypes";

export const useAverageTimeOrder = () => {
    const [armtime,setArtTime] = useState<Order[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response : Order[] = await new Promise((resolve) => 
                setTimeout(() => {
                    resolve([
                    {
                        id: 101,
                        status: OrderStatus.Prepared,
                        customerId: "Supermercado Alfa",
                        items: [],
                        orderDate: "2025-06-01",
                        startedDate: "2025-06-02 08:00",
                        finishDate: "2025-06-02 09:30",
                    },
                    {
                        id: 102,
                        status: OrderStatus.Prepared,
                        customerId: "Despensa Zeta",
                        items: [],
                        orderDate: "2025-06-03",
                        startedDate: "2025-06-04 10:15",
                        finishDate: "2025-06-04 11:45",
                    },
                    ])
                },1000)
            );

            setArtTime(response);
            }catch(error){
                setError("Hubo un error al cargar los datos.");
            }finally{
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {armtime,loading,error};
};