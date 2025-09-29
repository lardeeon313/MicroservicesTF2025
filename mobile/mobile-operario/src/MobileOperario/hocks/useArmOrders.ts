import { useEffect,useState } from "react";
import { GetArmOrdersService } from "../services/GetArmOrdersService";
import type { DepotOrderDTO } from "../types/OrderDTO";

export const useArmOrders = (operatorUserId: string) => {
    const [armOrders,setArmOrders] = useState<DepotOrderDTO[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!operatorUserId) {
            setError(new Error('ID de operador no válido'));
            setLoading(false);
            return;
        }

        const fetchArmOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await GetArmOrdersService(operatorUserId);
                setArmOrders(data);
            } catch (error: any) {
                console.error("❌ Error en useArmOrders:", error);
                
                // Crear mensaje de error más descriptivo
                let errorMessage = "Error desconocido al obtener pedidos";
                
                if (error.response?.status === 404) {
                    errorMessage = "Endpoint no encontrado. Verificar que el backend esté corriendo.";
                } else if (error.response?.status === 500) {
                    errorMessage = "Error interno del servidor.";
                } else if (error.code === 'ECONNREFUSED') {
                    errorMessage = "No se puede conectar al servidor. Verificar que esté corriendo en el puerto 5000.";
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                setError(new Error(errorMessage));
                setArmOrders([]);
            } finally {
                setLoading(false);
            }
        }; 
        fetchArmOrders();
    }, [operatorUserId]);

    return {armOrders, loading, error};
}