import { useState,useEffect } from "react";
import type { Order } from "../../../../../sales/types/OrderTypes";
import API from "../../../../../../api/axios";

export const useAverageTimeOrder = (page:number,pageSize: number) => {
    const [data,setData] = useState<Order[]>([]);
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const response = await API.get<Order[]>("/orders") //Modificar ruta

                const start = (page - 1) * pageSize;
                const end = start + pageSize;
                const paginatedData = response.data.slice(start, end);

                setData(paginatedData);
                setTotalPages(Math.ceil(response.data.length / pageSize));
            }catch(error){
                console.error(error);
                setError("Hubo un error al cargar los datos");
            }finally{
                setLoading(false);
            }
        };

        fetchData();
    },[page,pageSize]);

    return {data,loading,error,totalPages}
}