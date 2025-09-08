//trae a todos los pedidos con el estado de Prepared =preparado que es lo mismo que 
//decir armado
import API from "../../services/axios";
import type { DepotOrderDTO } from "../types/OrderDTO";
import { DepotOrderStatus } from "../types/OrderDTO";

export const GetArmOrdersService = async(operatorUserId:string) : Promise<DepotOrderDTO[]> => {
    try{
        //trae todos los pedidos ya asignados:
        const response = await API.get('/depot/depotoperator/get-orders-to-operator', 
            {
                params: {
                    operatorUserId: operatorUserId, // Corregido: debe coincidir con el backend
                }
            }
        );
        const AllOrders : DepotOrderDTO[] = response.data; 

        //filtra 
        /*return AllOrders.filter(order => {
            order.status === DepotOrderStatus.InPreparation
        })*/
       return AllOrders;

    }catch(error: any){
        console.error("Momentanamente, no se pudo obtener los pedidos ", error);
        
        // Manejo específico de errores HTTP
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error("Error del servidor:", error.response.status, error.response.data);
            
            if (error.response.status === 404) {
                console.error("Endpoint no encontrado. Verificar que el backend esté corriendo y la URL sea correcta.");
            } else if (error.response.status === 500) {
                console.error("Error interno del servidor.");
            }
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            console.error("No se pudo conectar con el servidor. Verificar que esté corriendo en:", API.defaults.baseURL);
        } else {
            // Algo pasó al configurar la petición
            console.error("Error al configurar la petición:", error.message);
        }
        
        throw error; // Re-lanzar el error para que el hook lo maneje
    }
}