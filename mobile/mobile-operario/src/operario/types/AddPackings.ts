//Represta cada uno de los items para agregar: 
export interface AddPackingRequest {
    depotOrderItemId: number; 
    packagingType: string;  
}

export interface AddPackingCommand {
    packagingItems : AddPackingRequest[];
}

//Para marcar un producto del pedido como check
export interface MarkItemCommand {
    OrderItemId: number; 
    OperatorUserId: string; 
}

//para desmarcar un producto dentro del pedido
export interface UnMarkItemReadyCommand {
    OrderItemId: number;
}