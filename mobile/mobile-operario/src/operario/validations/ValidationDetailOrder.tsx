//Validacion que valida que todos los productos de tal pedido con status de inPreparation esten 
//con la propiedad isReady en 1 para recien ahi poder facturar el pedido: 

type ItemProduct = {
    id: number,
    nameProduct:string; 
    isReady: boolean;
}

export const CanInvoceOrder = (items: ItemProduct[]): boolean => {
    return items.every(item => item.isReady === true);
}