 

type ItemProduct = {
    id: number,
    nameProduct:string; 
    isReady: boolean;
}

export const CanInvoceOrder = (items: ItemProduct[]): boolean => {
    return items.every(item => item.isReady === true);
}