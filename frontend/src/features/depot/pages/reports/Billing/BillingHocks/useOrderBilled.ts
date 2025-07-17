import { useEffect,useState } from "react";
import API from "../../../../../../api/axios";
import type { BillingTimeProcess } from "../../../../billingmanager/types/BillingTimeProcessType";

export const useOrderBilled = (page:number,pageSize:number) => {
    const [data,setData] = useState<BillingTimeProcess[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    const [totalpages,settotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await API.get("/billingTimeProcess" , {
                    params: {page,pageSize}
                })

                const totalCount = Number(response.headers["x-total-count"]);
                settotalPages(Math.ceil(totalCount / pageSize));

                setData(response.data);
            }catch(error){
                console.error(error);
                setError("Error al obtener los datos.")
            }finally{
                setLoading(false);
            }
        }

        fetchData();
    }, [page,pageSize])

    return {data,loading,error,totalpages}
}