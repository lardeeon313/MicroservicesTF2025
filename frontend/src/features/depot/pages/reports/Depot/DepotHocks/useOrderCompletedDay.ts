import { useEffect,useState } from "react";
import { OrderStatus, type Order } from "../../../../../sales/types/OrderTypes";

type OrderForDay = {
    date:string;
    total:number;
};

export const useOrderCompletedDay = () => {
    const [data,setData] = useState<OrderForDay[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const orders: Order[] = await new Promise((resolve) => 
                    setTimeout(() => {
                        //se utiilzo mock datos: 
                        resolve([
                            { id: 1, finishDate: "2025-06-03 10:00", startedDate: "", orderDate: "", customerId: "", status: OrderStatus.Prepared, items: [] },
                            { id: 2, finishDate: "2025-06-03 12:00", startedDate: "", orderDate: "", customerId: "", status: OrderStatus.Prepared, items: [] },
                            { id: 3, finishDate: "2025-06-04 09:30", startedDate: "", orderDate: "", customerId: "", status: OrderStatus.Prepared, items: [] },
                            { id: 4, finishDate: "2025-06-04 16:00", startedDate: "", orderDate: "", customerId: "", status: OrderStatus.Prepared, items: [] },
                            { id: 5, finishDate: "2025-06-05 08:45", startedDate: "", orderDate: "", customerId: "", status: OrderStatus.Prepared, items: [] },
                        ])
                    },1000)
                );

                const countByDate : {[date: string] : number} = {};

                orders.forEach((order) => {
                    const date = order.finishDate.split("")[0];
                    countByDate[date] = (countByDate[date] || 0 ) + 1;
                });

                const result: OrderForDay[] = Object.entries(countByDate).map(([date, total]) => ({
                date,
                total,
                }));

                setData(result);
            }catch(error){
                setError("Error al cargar los pedidos");
            } finally{
                setLoading(false);
            }
        }; 

        fetchData();

    }, []);

    return {data,loading,error};
}