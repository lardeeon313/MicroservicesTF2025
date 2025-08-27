// useSendOrderToBilled.ts
import { useState } from "react";
import { SetOrderToBilled } from "../services/SetOrderToBilled";

export const useSendOrderToBilled = () => {
    const [loading, setloading] = useState(false);
    const [error ,setError] = useState<string | null>(null);
    const [success,setSucess] = useState(false);

    const SendOrder = async (orderId: number): Promise<{ ok: boolean; error?: string }> => {
        setloading(true);
        setError(null);
        setSucess(false);

        try
        {
            await SetOrderToBilled(orderId);
            setSucess(true);
            return {ok:true}
        }catch(err: any)
        {
            // ¡AGREGÁ ESTE CONSOLE.LOG!
            console.error("Error completo capturado en el hook:", JSON.stringify(err, null, 2));

            const errorMsg =
                typeof err === "object" && err !== null && "response" in err
                ? (err as any).response?.data?.message || 'Se obtuvo un error al enviar el pedido a facturación.'
                : 'Unicamente error.';
            setError(errorMsg);
            return { ok: false, error: errorMsg }
        }finally
        {
            setloading(false);
        }
    }

    return {SendOrder,loading,error,success};
}