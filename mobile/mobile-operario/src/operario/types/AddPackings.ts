//Represta cada uno de los items para agregar: 
export interface AddPackingRequest {
    DepotOrderItemId: number; 
    PackaingType: string;  
}

export interface AddPackingCommand {
    PackaingItems : AddPackingRequest[];
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