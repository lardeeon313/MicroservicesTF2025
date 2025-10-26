import { useEffect, useState, useCallback } from 'react';
import { 
  getOrdersByStatus, 
  getOrderById,
  setPriority,
  verifyOrder,
  checkCashOrder as checkCashOrderService,
  assignOperator,
  removeOperator
} from '../services/OrderService';
import { 
  LogisticOrderDto, 
  OrderStatus, 
  SetPriorityRequest,
  AssignOperatorRequest,
  RemoveAssignOperatorRequest
} from '../types/OrderTypes';

// Hook para órdenes por estado específico
export function useOrdersByStatus(status: OrderStatus) {
  const [orders, setOrders] = useState<LogisticOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrdersByStatus(status);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders
  };
}

// Hook para órdenes pendientes de verificación (estado 14)
export function usePendingVerificationOrders() {
  const [orders, setOrders] = useState<LogisticOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    getOrdersByStatus(OrderStatus.PendingVerification)
      .then(setOrders)
      .catch(() => {
        setError('Error al cargar las órdenes pendientes de verificación.');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

// Hook para órdenes verificadas (estado 7)
export function useVerifiedOrders() {
  const [orders, setOrders] = useState<LogisticOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    getOrdersByStatus(OrderStatus.Verified)
      .then(setOrders)
      .catch(() => {
        setError('Error al cargar las órdenes verificadas.');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

// Hook para órdenes asignadas a reparto (estado 17)
export function useAssignedDeliveryOrders() {
  const [orders, setOrders] = useState<LogisticOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    getOrdersByStatus(OrderStatus.AssignedDelivery)
      .then(setOrders)
      .catch(() => {
        setError('Error al cargar las órdenes asignadas a reparto.');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

// Hook para órdenes con asignación cancelada (estado 16)
export function useAssignmentCancelledOrders() {
  const [orders, setOrders] = useState<LogisticOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    getOrdersByStatus(OrderStatus.AssignmentCancelled)
      .then(setOrders)
      .catch(() => {
        setError('Error al cargar las órdenes con asignación cancelada.');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

// Hook para órdenes con incidentes pendientes de resolución (estado 20)
export function usePendingIncidentResolutionOrders() {
  const [orders, setOrders] = useState<LogisticOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    getOrdersByStatus(OrderStatus.PendingIncidentResolution)
      .then(setOrders)
      .catch(() => {
        setError('Error al cargar las órdenes con incidentes pendientes.');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

// Hook para órdenes con incidentes resueltos (estado 21)
export function useIncidentResolvedOrders() {
  const [orders, setOrders] = useState<LogisticOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    getOrdersByStatus(OrderStatus.IncidentResolved)
      .then(setOrders)
      .catch(() => {
        setError('Error al cargar las órdenes con incidentes resueltos.');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

// Hook para detalles de una orden específica
export function useOrderDetails(orderId: number | undefined) {
  const [order, setOrder] = useState<LogisticOrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(() => {
    if (!orderId) return;
    
    setLoading(true);
    setError(null);
    getOrderById(orderId)
      .then(setOrder)
      .catch(() => {
        setError('Error al cargar los detalles de la orden.');
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
}

// Hook para operaciones de órdenes (set priority, verify, assign operator)
export function useOrderOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setOrderPriority = useCallback(async (request: SetPriorityRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await setPriority(request);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al establecer la prioridad de la orden.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOrderAction = useCallback(async (orderId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await verifyOrder(orderId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al verificar la orden.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkCashOrderAction = useCallback(async (orderId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await checkCashOrder(orderId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al verificar la orden con pago en efectivo.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const assignOperatorToOrder = useCallback(async (request: AssignOperatorRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await assignOperator(request);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al asignar el operador a la orden.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeOperatorFromOrder = useCallback(async (request: RemoveAssignOperatorRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await removeOperator(request);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al remover el operador de la orden.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkCashOrder = useCallback(async (logisticOrderId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await checkCashOrderService(logisticOrderId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al verificar el efectivo de la orden.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    setOrderPriority,
    verifyOrderAction,
    checkCashOrderAction,
    assignOperatorToOrder,
    removeOperatorFromOrder,
    checkCashOrder,
    clearError: () => setError(null)
  };
}
