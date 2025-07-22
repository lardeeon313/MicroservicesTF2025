import API from "../../../../api/axios";
import { 
    DepotOrderDto, 
    DepotOrderEntity, 
    DepotOrderMissingDto,
    DepotOrderItemsReportedDto
} from "../types/OrderTypes";
import { 
    AssignOrderRequest
} from "../types/OperatorTypes";

// Tipos para las peticiones
export interface OrderMissingReportedRequest {
    depotOrderId: number;
    missingItems: DepotOrderItemsReportedDto[];
    missingReason?: string;
    missingDescription?: string;
}

// FUNCIONES CON API REAL - Rutas corregidas según el controlador DepotManagerController
export const assignOperator = async (
    orderId: number, 
    request: AssignOrderRequest
): Promise<void> => {
    console.log('assignOperator called with:', { orderId, request });
    const response = await API.post(`/depot/depotmanager/${orderId}/assign`, request);
    console.log('assignOperator response:', response);
};

export const reportMissingOrder = async (
    request: OrderMissingReportedRequest
): Promise<{ message: string }> => {
    const response = await API.post("/depot/depotmanager/report-missing-order", request);
    return response.data;
};

export const getOrdersByStatus = async (status: string): Promise<DepotOrderDto[]> => {
    console.log('getOrdersByStatus called with status:', status);
    try {
        const response = await API.get(`/depot/depotmanager/get-orders-by-status/${status}`);
        console.log('getOrdersByStatus response:', response.data);
        return response.data;
    } catch (error) {
        console.error('getOrdersByStatus error:', error);
        throw error;
    }
};

export const getAllOrders = async (): Promise<DepotOrderDto[]> => {
    const response = await API.get("/depot/depotmanager/get-all-orders");
    return response.data;
};

export const getOrderById = async (depotOrderId: number): Promise<DepotOrderEntity> => {
    const response = await API.get(`/depot/depotmanager/get-order-by-id/${depotOrderId}`);
    return response.data;
};

export const getMissingOrders = async (): Promise<DepotOrderMissingDto[]> => {
    const response = await API.get("/depot/depotmanager/get-all-missing-orders");
    return response.data;
};

export const getMissingOrderById = async (missingOrderId: number): Promise<DepotOrderMissingDto> => {
    const response = await API.get(`/depot/depotmanager/get-missing-order-by-id/${missingOrderId}`);
    return response.data;
};