import API from "../../../api/axios";
import { Order, OrderMissingDto, OrderReissuedRequest, SalesPerfomanceDto } from "../types/OrderTypes";
import {
   UpdateOrderRequest, 
   UpdateOrderStatusRequest, 
   RegisterOrderRequest,
   CancelOrderRequest,
   DeleteOrderRequest } from "../types/OrderTypes";
import { Address } from "../types/CustomerTypes";
import { CustomerPaymenType } from "../types/CustomerTypes";

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

// Registrar una nueva orden (ACTUALIZADO : NO TIRA EL ERROR DEL LADO VISUAL)
export const registerOrder = async (data: RegisterOrderRequest): Promise<any> => {
  const response = await API.post("/sales/Order/register", data, {
    validateStatus: () => true,
  });

  // Si el backend devolvió 500 pero contiene OrderId => se registró igual
  const orderRegisteredAnyway =
    response.status === 500 && response.data?.id;

  if ((response.status >= 200 && response.status < 300) || orderRegisteredAnyway) {
    return {
      ok: true,
      data: response.data ?? null,
      status: response.status
    };
  }

  return Promise.reject({
    ok: false,
    status: response.status,
    data: response.data
  });
};



// Actualizar orden
export const updateOrder = async (id: number, data: UpdateOrderRequest): Promise<Order> => {

  const response = await API.put(`/sales/order/update/${id}`, data);

  return response.data;
};

// Actualizar orden con faltante
export const updateMissingOrder = async (
  id: number,
  data: UpdateOrderRequest
): Promise<OrderMissingDto> => {
  const response = await API.put(`/sales/order/update/missingOrder/${id}`, data);
  return response.data;
};

// Cancelar orden con faltante
export const cancelMissingOrder = async (
  id: number,
  data: CancelOrderRequest
): Promise<{ message: string }> => {
  const response = await API.post(`/sales/order/cancel`, { id, ...data });
  return response.data;
};

// Reemitir orden (cambiar estado + publicar evento)
export const reissueOrder = async (data: OrderReissuedRequest) => {
  const response = await API.put("/sales/order/reissued", data);
  return response.data;
};

// Traer todas las órdenes con faltante (puede filtrarse por status en backend)
export const getAllMissingOrders = async (): Promise<OrderMissingDto[]> => {
  const response = await API.get("/sales/order/missings");
  return response.data;
};

// Traer orden con faltante por ID
export const getMissingOrderById = async (id: number): Promise<OrderMissingDto> => {
  const response = await API.get(`/sales/order/missing/${id}`);
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
// En services/OrderService.ts
export const getSalesPerfomance = async (
    from?: string,
    to?: string,
    range?: "all" | "quincena" | "mensual" | "trimestral" | "semestral" | "anual"
) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (range) params.append('range', range); // Añadir el parámetro range

    const response = await API.get(`/sales/Order/report/performance?${params.toString()}`);
    return response.data;
};


//Obtiene las direcciones asociadas a un cliente especifico: 
export const getCustomerAddresses = async (customerId: string): Promise<Address[]> => {
  const response = await API.get(`/sales/Order/addresses`, {
    params: { customerId }
  });
  return response.data;
};

//Obtiene todos los tipos de pago segun el tipo de cliente: 

export const getCustomerPaymentTypes = async (
  customerId: string
): Promise<CustomerPaymenType[]> => {
  try {
    const response = await API.get<CustomerPaymenType[]>(
      `/sales/Customer/payment-types/${customerId}`
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 404) {
        // Manejo explícito del mensaje del backend
        const message =
          data?.message || "El cliente no no tiene los tipos de pago.";
        console.warn(message);
        return [];
      }

      if (status === 500) {
        console.error("Internal Server Error:", data);
        throw new Error("Internal Server Error");
      }
    }

    console.error("Unexpected error while fetching customer payment types:", error);
    throw error;
  }
};

