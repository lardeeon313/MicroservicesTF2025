import axios from '../../../../api/axios';
import { DepotOrderDto } from '../types/OrderTypes';

// Obtener todas las órdenes pendientes de facturación
export const getPendingBillingOrders = async (): Promise<DepotOrderDto[]> => {
  const { data } = await axios.get<DepotOrderDto[]>('/api/billingmanager/pending-billing-orders');
  return data;
};

// Obtener detalles de una orden pendiente por ID
export const getPendingOrderDetails = async (depotOrderId: number): Promise<DepotOrderDto> => {
  const { data } = await axios.get<DepotOrderDto>('/api/billingmanager/orders-pending-billing', {
    params: { DepotOrderId: depotOrderId },
  });
  return data;
};

// Asignar precios unitarios a los ítems de una orden
export const setItemUnitPrices = async (payload: {
  DepotOrderId: number;
  ItemUnitPrices: { ItemId: number; UnitPrice: number }[];
}): Promise<void> => {
  await axios.post('/api/billingmanager/set-item-unit-prices', payload);
};

// Facturar una orden
export const invoiceOrder = async (depotOrderId: number): Promise<void> => {
  await axios.post('/api/billingmanager/invoice-order', depotOrderId, {
    headers: { 'Content-Type': 'application/json' },
  });
};

// Obtener todas las órdenes facturadas
export const getAllInvoicedOrders = async (): Promise<DepotOrderDto[]> => {
  const { data } = await axios.get<DepotOrderDto[]>('/api/billingmanager/all-invoiced-orders');
  return data;
};

// Obtener una orden facturada por ID
export const getInvoicedOrderById = async (billingOrderId: number): Promise<DepotOrderDto> => {
  const { data } = await axios.get<DepotOrderDto>('/api/billingmanager/invoiced-order-by-id', {
    params: { BillingOrderId: billingOrderId },
  });
  return data;
};

// Obtener órdenes facturadas por rango de fechas
export const getInvoicedOrdersByDateRange = async (startDate: string, endDate: string): Promise<DepotOrderDto[]> => {
  const { data } = await axios.get<DepotOrderDto[]>('/api/billingmanager/invoiced-orders-by-date-range', {
    params: { StartDate: startDate, EndDate: endDate },
  });
  return data;
};

// Obtener órdenes facturadas por cliente
export const getInvoicedOrdersByCustomer = async (customerId: string): Promise<DepotOrderDto[]> => {
  const { data } = await axios.get<DepotOrderDto[]>('/api/billingmanager/invoiced-orders-by-customer', {
    params: { CustomerId: customerId },
  });
  return data;
};

// Actualizar el precio de un ítem facturado
export const updateInvoicedItemPrice = async (payload: {
  BillingOrderId: number;
  ItemId: number;
  NewUnitPrice: number;
}): Promise<void> => {
  await axios.put('/api/billingmanager/update-invoiced-item-price', payload);
}; 