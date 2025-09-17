import axios from '../../../../api/axios';
import { DepotOrderDto } from '../types/OrderTypes';



// Obtener todas las órdenes pendientes de facturación
export const getPendingBillingOrders = async (): Promise<DepotOrderDto[]> => {
  const { data } = await axios.get<DepotOrderDto[]>('/depot/billingmanager/pending-billing-orders');
  return data;
};

// Obtener detalles de una orden pendiente por ID
export const getPendingOrderDetails = async (depotOrderId: number): Promise<DepotOrderDto> => {
  const { data } = await axios.get<DepotOrderDto>('/depot/billingmanager/pending-billing-orders', {
    params: { depotOrderId },
  });
  return data;
};

// Asignar precios unitarios a los ítems de una orden
export const setItemUnitPrices = async (payload: {
  depotOrderId: number;
  itemUnitPrices: { itemId: number; unitPrice: number }[];
}): Promise<void> => {
  await axios.post('/depot/billingmanager/set-item-unit-prices', payload);
};

// Facturar una orden
export const invoiceOrder = async (depotOrderId: number): Promise<void> => {
  await axios.post('/depot/billingmanager/invoice-order', depotOrderId, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const getAllInvoicedOrders = async (): Promise<any[]> => {
  const { data } = await axios.get('/depot/billingmanager/all-invoiced-orders');
  return data;
};

export const getInvoicedOrderById = async (billingOrderId: number): Promise<any> => {
  const { data } = await axios.get('/depot/billingmanager/invoiced-order-by-id', { params: { billingOrderId } });
  return data;
};

export const getInvoicedOrdersByDateRange = async (startDate: string, endDate: string): Promise<any[]> => {
  const { data } = await axios.get('/depot/billingmanager/invoiced-orders-by-date-range', { params: { startDate, endDate } });
  return data;
};

export const getInvoicedOrdersByCustomer = async (customerName: string): Promise<any[]> => {
  const { data } = await axios.get('/depot/billingmanager/invoiced-orders-by-customer', { params: { customerName } });
  return data;
};

export const updateInvoicedItemPrice = async (payload: { billingOrderId: number; itemId: number; newUnitPrice: number }): Promise<void> => {
  await axios.put('/depot/billingmanager/update-invoiced-item-price', payload);
}; 

//: Service para exportar pdf , excel y word: 

export const exportInvoice = async (billingOrderId: number, type: number) => {
  try {
    const response = await axios.get('/depot/billingmanager/export-invoice', {
      params: { billingOrderId, type },
      responseType: "blob",
    });

    return response.data; // 👈 YA es un Blob
  } catch (error) {
    console.error("Error al exportar la factura:", error);
    throw error;
  }
}
