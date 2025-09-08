// Tipos para agregar empaque a los items de pedido
export interface AddPackagingRequest {
    depotOrderItemId: number;
    packagingType: string;
}

// Comando para agregar múltiples empaques (según el backend)
export interface AddPackagingCommand {
    packagingItems: AddPackagingRequest[];
}

export interface MarkItemCommand {
    orderItemId: number; // Corregido: debe ser OrderItemId según el backend
    operatorUserId: string; // Corregido: debe ser OperatorUserId según el backend
}

export interface UnMarkItemReadyCommand {
    orderItemId: number; // Corregido: debe ser OrderItemId según el backend
}

// Interfaz para la respuesta del servicio
export interface AddPackagingResponse {
    success: boolean;
    message: string;
    orderItemId?: number;
}

// Comando para rechazar pedidos (movido a RejectOrder.ts)
// export interface RejectOrderCommand {
//     depotOrderId: number;
//     operatorUserId: string;
//     rejectionReason: string;
// }