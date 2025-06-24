import { useState } from "react";
import { SetOrderToBilled } from "../services/SetOrderToBilled";

export const useSendOrderToBilled = () => {
    const [loading, setloading] = useState(false);
    const [error ,setError] = useState<string | null>(null);
    const [success,setSucess] = useState(false);

    const SendOrder = async (orderId: number) => {
        setloading(true);
        setError(null);
        setSucess(false);

        try
        {
            await SetOrderToBilled(orderId);
            setSucess(true);
        }catch(err: any)
        {
            if (typeof err === "object" && err !== null && "response" in err) {
                setError((err as any).response?.data?.message || 'Se obtuvo un error al enviar el pedido a facturacion.');
            } else {
                setError('Unicamente error.');
            }
        }finally
        {
            setloading(false);
        }
    }

    return {SendOrder,loading,error,success};
}