import API from "../../../api/axios";
import {
  LogisticOrderDto,
  LogisticPagedOrderDto,
  AssignOperatorRequest,
  RemoveAssignOperatorRequest,
  SetPriorityRequest,
  OrderStatus,
  DeliveryPriority,
} from "../types/OrderTypes";

// ========== ORDER OPERATIONS ==========

// Asignar un operador a una orden logística
export const assignOperator = async (request: AssignOperatorRequest): Promise<string> => {
  try {
    // Primero intentamos el endpoint nuevo (AssignOrder command)
    const payloadNew = {
      LogisticOrderId: request.logisticOrderId,
      OperatorUserId: request.operatorUserId,
    };
    try {
      const response = await API.post("/logistic/VerificationManager/assign-order", payloadNew);
      return response.data || 'Operador asignado correctamente.';
    } catch (err: any) {
      // si es 404 o 405 o cualquier fallo, intentamos legacy
      const payloadLegacy = {
        LogisticOrderId: request.logisticOrderId,
        OperatorUserId: request.operatorUserId,
      };
      const responseLegacy = await API.post('/logistic/VerificationManager/assign-operator', payloadLegacy);
      return responseLegacy.data || 'Operador asignado correctamente.';
    }
  } catch (error: any) {
    // Re-throw para que el hook pueda capturarlo y mostrar mensaje
    throw { message: error.message, status: error.response?.status, data: error.response?.data };
  }
};

// Remover la asignación de un operador de una orden logística
export const removeOperator = async (request: RemoveAssignOperatorRequest): Promise<string> => {
  try {
    // Intentamos endpoint nuevo
    const resp = await API.post('/logistic/VerificationManager/remove-assign-order', {
      LogisticOrderId: request.logisticOrderId,
      OperatorUserId: request.operatorUserId,
    });
    return resp.data || 'Operador removido correctamente.';
  } catch (err: any) {
    // Legacy: POST remove-operator or DELETE remove-operator/:id depending on implementation
    try {
      const resp2 = await API.post('/logistic/VerificationManager/remove-operator', {
        logisticOrderId: request.logisticOrderId,
        operatorUserId: request.operatorUserId,
      });
      return resp2.data || 'Operador removido correctamente.';
    } catch (err2: any) {
      throw { message: err2.message, status: err2.response?.status, data: err2.response?.data };
    }
  }
};

// Establecer la prioridad de una orden logística
export const setPriority = async (request: SetPriorityRequest): Promise<string> => {
  try {
    const resp = await API.post('/logistic/VerificationManager/set-priority-order', {
      LogisticOrderId: request.logisticOrderId,
      DeliveryPriority: request.deliveryPriority,
    });
    return resp.data || 'Prioridad establecida correctamente.';
  } catch (err: any) {
    try {
      const resp2 = await API.post('/logistic/VerificationManager/set-priority', {
        logisticOrderId: request.logisticOrderId,
        deliveryPriority: request.deliveryPriority,
      });
      return resp2.data || 'Prioridad establecida correctamente.';
    } catch (err2: any) {
      throw { message: err2.message, status: err2.response?.status, data: err2.response?.data };
    }
  }
};

// Verificar una orden logística
export const verifyOrder = async (logisticOrderId: number): Promise<string> => {
  try {
    // Primero intentamos endpoint que espera body
    const response = await API.post(`/logistic/VerificationManager/verified-order`, { LogisticOrderId: logisticOrderId });
    return response.data || 'Orden verificada correctamente.';
  } catch (err: any) {
    // Fallback por compatibilidad: endpoint con id en la ruta
    console.warn('Service: verified-order con body falló, intentando fallback por id...', err?.message);
    const response = await API.post(`/logistic/VerificationManager/verify-order/${logisticOrderId}`);
    return response.data || 'Orden verificada correctamente.';
  }
};

// Verificar una orden logística de tipo Cash
export const checkCashOrder = async (logisticOrderId: number): Promise<string> => {
  const response = await API.post(`/logistic/VerificationManager/check-cash-order/${logisticOrderId}`);
  return response.data || 'Orden con pago en efectivo verificada correctamente.';
};

// ========== ORDER QUERIES ==========

// Obtener órdenes por prioridad de entrega
export const getOrdersByDeliveryPriority = async (deliveryPriority: DeliveryPriority): Promise<LogisticOrderDto[]> => {
  const response = await API.get(`/logistic/VerificationManager/get-orders-by-priority/${deliveryPriority}`);
  return response.data;
};

// Obtener todas las órdenes logísticas
export const getAllOrders = async (): Promise<LogisticOrderDto[]> => {
  const response = await API.get("/logistic/VerificationManager/get-all-orders");
  return response.data;
};

// Obtener órdenes por ID de cliente
export const getOrdersByCustomerId = async (customerId: string): Promise<LogisticOrderDto[]> => {
  const response = await API.get(`/logistic/VerificationManager/get-orders-by-customer/${customerId}`);
  return response.data;
};

// Obtener una orden logística por su ID
export const getOrderById = async (id: number): Promise<LogisticOrderDto> => {
  const response = await API.get(`/logistic/VerificationManager/get-order-by-id/${id}`);
  return response.data;
};

// Obtener órdenes por estado
export const getOrdersByStatus = async (status: OrderStatus): Promise<LogisticOrderDto[]> => {
  const response = await API.get(`/logistic/VerificationManager/get-orders-by-status/${status}`);
  return response.data;
};

// Obtener órdenes paginadas
export const getPagedOrders = async (pageNumber: number = 1, pageSize: number = 20): Promise<LogisticPagedOrderDto> => {
  const response = await API.get("/logistic/VerificationManager/get-paged-orders", {
    params: { pageNumber, pageSize }
  });
  return response.data;
};

// Obtener órdenes por zona de entrega
export const getOrdersByDeliveryZoneId = async (zoneId: number): Promise<LogisticOrderDto[]> => {
  const response = await API.get(`/logistic/VerificationManager/get-orders-by-delivery-zone/${zoneId}`);
  return response.data;
};

// Obtener órdenes por equipo de reparto
export const getOrdersByTeamId = async (teamId: number): Promise<LogisticOrderDto[]> => {
  const response = await API.get(`/logistic/VerificationManager/get-orders-by-team/${teamId}`);
  return response.data;
};

// Obtener órdenes por operador
export const getOrdersByOperatorId = async (operatorUserId: string): Promise<LogisticOrderDto[]> => {
  const response = await API.get(`/logistic/VerificationManager/get-orders-by-operator/${operatorUserId}`);
  return response.data;
};

