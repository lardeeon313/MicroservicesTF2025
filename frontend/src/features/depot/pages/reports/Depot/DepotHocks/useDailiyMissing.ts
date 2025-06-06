import { useEffect,useState } from "react";
import type { DailyMissing } from "../DepotComponents/DailyMissingTable";

export const useDailyMissing = ( ) => {
    const [data,setData] = useState<DailyMissing[]>([]);
    const [loading,setloading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await new Promise<DailyMissing[]>((resolve) => 
                setTimeout(() => {
                    resolve([
                    { orderID:2 , ItemID: 101,MissingHour: "08:15" },
                    { orderID:3 , ItemID: 102,MissingHour: "12:15" },
                    ]);
                }, 1000)
                );
                setData(response);
            }catch(error){
                console.error("Error para obtener los datos" , error);
            }finally{
                setloading(false);
            }
        };

        fetchData();
    }, []);

    return {data,loading};

}