import API from "../../../api/axios";
import { Order, SalesPerfomanceDto } from "../types/OrderTypes";
import {
   UpdateOrderRequest, 
   UpdateOrderStatusRequest, 
   RegisterOrderRequest,
   CancelOrderRequest,
   DeleteOrderRequest } from "../types/OrderTypes";


// Obtener todas las órdenes
export const getAllOrders = async (): Promise<Order[]> => {
  const response = await API.get("/sales/Order/all");
  return response.data;
};

// Obtener orden por ID
export const getOrderById = async (id: number): Promise<Order> => {
  const response = await API.get(`/sales/Order/${id}`);
  return response.data;
};

// Obtener órdenes por estado
export const getOrdersByStatus = async (status: string): Promise<Order[]> => {
  const response = await API.get(`/sales/Order/status/${status}`);
  return response.data;
};

// Obtener órdenes por cliente
export const getOrdersByCustomer = async (customerId: string): Promise<Order[]> => {
  const response = await API.get(`/sales/Order/customer/${customerId}`);
  return response.data;
};

// Registrar una nueva orden
export const registerOrder = async (data: RegisterOrderRequest): Promise<Order> => {
  const response = await API.post("/sales/Order/register", data);
  return response.data;
};

// Actualizar orden
export const updateOrder = async (id: number, data: UpdateOrderRequest): Promise<Order> => {
  const response = await API.put(`/sales/order/update/${id}`, data);
  return response.data;
};

// Actualizar estado de orden
export const updateOrderStatus = async (
  id: number,
  data: UpdateOrderStatusRequest
): Promise<{ message: string }> => {
  const response = await API.put(`/sales/order/updateStatus/${id}`, data);
  return response.data;
};

// Cancelar orden
export const cancelOrder = async (
  id: number,
  data: CancelOrderRequest
): Promise<{ message: string }> => {
  const response = await API.put(`/sales/order/cancel/${id}`, data);
  return response.data;
};

// Eliminar orden
export const deleteOrder = async (
  id: number,
  data: DeleteOrderRequest
): Promise<{ message: string }> => {
  const response = await API.delete(`/sales/order/delete/${id}`, { data });
  return response.data;
};

// Obtener órdenes paginadas
export const getPagedOrders = async (pageNumber = 1, pageSize = 20): Promise<{
  totalCount: number;
  totalPages: number;
  currentPage: number;
  orders: Order[];
}> => {
  const response = await API.get(`/sales/Order/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return response.data;
};

// Obtener los pedidos ordenados por userId para el reporte PerfomanceSales
export const getSalesPerfomance = async (): Promise<SalesPerfomanceDto[]> => {
  const response = await API.get("/sales/Order/report/performance");
  return response.data;
}


