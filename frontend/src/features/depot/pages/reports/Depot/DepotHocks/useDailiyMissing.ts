import { useEffect,useState } from "react";
import type { DailyMissing } from "../DepotComponents/DailyMissingTable";
import API from "../../../../../../api/axios";


export const useDailyMissing = (page:number,pageSize:number) => {
    const [data,setData] = useState<DailyMissing[]>([]);
    const [loading,setLoading] = useState<boolean>(true);
    const [error,setError] = useState<string | null>(null);
    const [totalPages,setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const response = await API.get<DailyMissing[]>("/missings");

                const allData = response.data;
                const start = (page - 1) * pageSize;
                const end = start + pageSize;
                const paginatedData = allData.slice(start, end);

                setData(paginatedData);
                setTotalPages(Math.ceil(allData.length / pageSize));
            }catch(error){
                console.error("Error al obtener los datos: " , error);
                setError("No se pudieron obtener los datos ");
            }finally{
                setLoading(false);
            }
        }

        fetchData();
    }, [page,pageSize]);

    return {data,loading,error,totalPages};
};