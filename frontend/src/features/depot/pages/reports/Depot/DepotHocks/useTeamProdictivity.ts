import { useEffect, useState } from "react";
import type { DepotTeam } from "../../../../depotmanager/types/DepotTeamTypes";
import API from "../../../../../../api/axios";


type ProdictivityProps = {
    teamId: DepotTeam['id'];
    completedOrders: number; 
}

export const useTeamProdictivity = (page: number, pageSize: number) => {
    const [data,setData] = useState<ProdictivityProps[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    const [totalpages,setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchTeamProdictivity = async () => {
            setLoading(true);
            setError(null);
            try{
                const response = await API.get<ProdictivityProps[]>(
                    "/teams",
                    {
                        params: {page, pageSize},
                    }
                );

                
                const totalCount = Number(response.headers["x-total-count"]);
                setTotalPages(Math.ceil(totalCount / pageSize));
                setData(response.data);
            }catch(error){
                console.error("Error al obtener la productividad de los equipos:", error);
                setError("Error al obtener los datos.");
            }finally{
                setLoading(false);
            }
        };

        fetchTeamProdictivity();
    }, [page,pageSize]); 

    return {data,loading,error,totalpages}
};