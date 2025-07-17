import { useEffect,useState } from "react";
import API from "../../../../../../api/axios";
import type { Billing } from "../../../../billingmanager/types/BillingType";

export const useCustomerIncome = (page:number,pageSize:number) => {
    const [data,setData] = useState<Billing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    const [totalPages,setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await API.get("/billing" , {
                    params: {page,pageSize}
                })

                const totalCount = Number(response.headers["x-total-count"]);
                setTotalPages(Math.ceil(totalCount / pageSize));

                setData(response.data);
            }catch (error){
                console.error(error);
                setError("Error al obtener los datos.")
            }finally{
                setLoading(false);
            }
        }

        fetchData();
    }, [page,pageSize])

    return {data,loading,error,totalPages}
}