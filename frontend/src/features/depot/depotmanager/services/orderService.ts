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
    DepotOrderId: number;
    MissingItems: DepotOrderItemsReportedDto[];
    MissingReason?: string;
    MissingDescription?: string;
}

// FUNCIONES CON API REAL - Rutas corregidas según el controlador DepotManagerController
export const assignOperator = async (
    orderId: number, 
    request: AssignOrderRequest
): Promise<void> => {
    await API.post(`/api/depotmanager/${orderId}/assign`, request);
};

export const reportMissingOrder = async (
    request: OrderMissingReportedRequest
): Promise<{ message: string }> => {
    const response = await API.post("/api/depotmanager/report-missing-order", request);
    return response.data;
};

export const getOrdersByStatus = async (status: string): Promise<DepotOrderDto[]> => {
    const response = await API.get(`/api/depotmanager/get-orders-by-status/${status}`);
    return response.data;
};

export const getAllOrders = async (): Promise<DepotOrderDto[]> => {
    const response = await API.get("/api/depotmanager/get-all-orders");
    return response.data;
};

export const getOrderById = async (depotOrderId: number): Promise<DepotOrderEntity> => {
    const response = await API.get(`/api/depotmanager/get-order-by-id/${depotOrderId}`);
    return response.data;
};

export const getMissingOrders = async (): Promise<DepotOrderMissingDto[]> => {
    const response = await API.get("/api/depotmanager/get-all-missing-orders");
    return response.data;
};

export const getMissingOrderById = async (missingOrderId: number): Promise<DepotOrderMissingDto> => {
    const response = await API.get(`/api/depotmanager/get-missing-order-by-id/${missingOrderId}`);
    return response.data;
};