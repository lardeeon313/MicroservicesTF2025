import { useEffect,useState } from "react";

type ProductivityItem = {
  teamId: string;
  completedOrders: number;
};

type Order = {
  id: number;
  finishDate: string;
  teamId: string;
};

export const useTeamProdictivity = () => {
    const [data, setData] = useState<ProductivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try{
                const orders: Order[] = await new Promise((resolve) => 
                    setTimeout(() => {
                        resolve([
                            { id: 1, finishDate: "2025-06-03", teamId: "Equipo A" },
                            { id: 2, finishDate: "2025-06-03", teamId: "Equipo A" },
                            { id: 3, finishDate: "2025-06-03", teamId: "Equipo B" },
                            { id: 4, finishDate: "2025-06-04", teamId: "Equipo C" },
                            { id: 5, finishDate: "2025-06-04", teamId: "Equipo B" },
                            { id: 6, finishDate: "2025-06-04", teamId: "Equipo A" },
                        ]);
                    },1000)
                );

                const result : { [team: string]: number } = {};

                orders.forEach((order) => {
                    result[order.teamId] = (result[order.teamId] || 0) + 1;
                });

                const formatted: ProductivityItem[] = Object.entries(result).map(
                    ([teamId, completedOrders]) => ({ teamId, completedOrders })
                );

                setData(formatted);
            }catch(error){
                setError("Error al obtener los datos: ");
            }finally{
                setLoading(false);
            }
        };

        fetchData();
    }, []) ;

    return {data,loading,error};
};