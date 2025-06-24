import { useState } from "react";
import { UnMarkItemIsReady } from "../services/PostAddPackings";
import type { UnMarkItemReadyCommand } from "../types/AddPackings";

export function useUnMarkItemReady(){
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState<null | Error>(null);
    const [success, setSuccess] = useState(false);

    const UnMarkItem = async (data: UnMarkItemReadyCommand) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
            await UnMarkItemIsReady(data);
            setSuccess(true);
        }catch(err){
            setError(err as Error);
        }finally{
            setLoading(false);
        }
    };

    return {UnMarkItem,loading, error,success}
};