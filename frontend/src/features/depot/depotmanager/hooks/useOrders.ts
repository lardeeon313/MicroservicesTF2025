import { useState, useEffect, useCallback } from 'react';
import { 
  getAllOrders, 
  getOrdersByStatus, 
  assignOperator, 
  reportMissingOrder,
  getMissingOrders,
  getOrderById as getOrderByIdService,
  OrderMissingReportedRequest
} from '../services/orderService';
import { getAllOperators } from '../services/operatorService';
import { 
  DepotOrderDto, 
  DepotOrderEntity, 
  DepotOrderMissingDto,
  OrderStatus 
} from '../types/OrderTypes';
import { OperatorDto, AssignOrderRequest } from '../types/OperatorTypes';

export interface UseOrdersReturn {
  // Estados
  orders: DepotOrderDto[];
  missingOrders: DepotOrderMissingDto[];
  operators: OperatorDto[];
  loading: boolean;
  error: string | null;
  
  // Estados específicos
  pendingOrders: DepotOrderDto[];
  preparedOrders: DepotOrderDto[];
  inPreparationOrders: DepotOrderDto[];
  
  // Funciones
  fetchAllOrders: () => Promise<void>;
  fetchOrdersByStatus: (status: OrderStatus) => Promise<void>;
  fetchMissingOrders: () => Promise<void>;
  fetchOperators: () => Promise<void>;
  assignOperatorToOrder: (orderId: number, operatorUserId: string) => Promise<void>;
  reportOrderMissing: (request: OrderMissingReportedRequest) => Promise<void>;
  getOrderById: (orderId: number) => Promise<DepotOrderEntity>;
  refetch: () => void;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<DepotOrderDto[]>([]);
  const [missingOrders, setMissingOrders] = useState<DepotOrderMissingDto[]>([]);
  const [operators, setOperators] = useState<OperatorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtrar órdenes por estado
  const pendingOrders = orders.filter(order => order.Status === OrderStatus.Issued);
  const preparedOrders = orders.filter(order => order.Status === OrderStatus.Prepared);
  const inPreparationOrders = orders.filter(order => order.Status === OrderStatus.InPreparation);

  const fetchAllOrders = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching all orders:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar las órdenes');
      // En caso de error, establecer un array vacío
      setOrders([]);
    }
  }, []);

  const fetchOrdersByStatus = useCallback(async (status: OrderStatus) => {
    try {
      setError(null);
      const data = await getOrdersByStatus(status);
      // Actualizar solo las órdenes del estado específico
      setOrders(prevOrders => {
        const otherOrders = prevOrders.filter(order => order.Status !== status);
        return [...otherOrders, ...data];
      });
    } catch (err) {
      console.error('Error fetching orders by status:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar las órdenes por estado');
    }
  }, []);

  const fetchMissingOrders = useCallback(async () => {
    try {
      setError(null);
      const data = await getMissingOrders();
      setMissingOrders(data);
    } catch (err) {
      console.error('Error fetching missing orders:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar las órdenes con faltantes');
      // En caso de error, establecer un array vacío
      setMissingOrders([]);
    }
  }, []);

  const fetchOperators = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllOperators();
      setOperators(data);
    } catch (err) {
      console.error('Error fetching operators:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los operadores');
      // En caso de error, establecer un array vacío
      setOperators([]);
    }
  }, []);

  const assignOperatorToOrder = useCallback(async (orderId: number, operatorUserId: string) => {
    try {
      setError(null);
      const request: AssignOrderRequest = { 
        DepotOrderId: orderId,
        OperatorUserId: operatorUserId 
      };
      await assignOperator(orderId, request);
      // Recargar órdenes después de asignar
      await fetchAllOrders();
    } catch (err) {
      console.error('Error assigning operator:', err);
      setError(err instanceof Error ? err.message : 'Error al asignar operador');
      throw err;
    }
  }, [fetchAllOrders]);

  const reportOrderMissing = useCallback(async (request: OrderMissingReportedRequest) => {
    try {
      setError(null);
      await reportMissingOrder(request);
      // Recargar órdenes después de reportar faltante
      await fetchAllOrders();
      await fetchMissingOrders();
    } catch (err) {
      console.error('Error reporting missing order:', err);
      setError(err instanceof Error ? err.message : 'Error al reportar orden faltante');
      throw err;
    }
  }, [fetchAllOrders, fetchMissingOrders]);

  const getOrderById = useCallback(async (orderId: number): Promise<DepotOrderEntity> => {
    try {
      setError(null);
      return await getOrderByIdService(orderId);
    } catch (err) {
      console.error('Error getting order by id:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener la orden');
      throw err;
    }
  }, []);

  const refetch = useCallback(() => {
    fetchAllOrders();
    fetchMissingOrders();
    fetchOperators();
  }, [fetchAllOrders, fetchMissingOrders, fetchOperators]);

  // Cargar datos iniciales solo una vez
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Ejecutar las llamadas en paralelo para mejor rendimiento
        await Promise.allSettled([
          fetchAllOrders(),
          fetchMissingOrders(),
          fetchOperators()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // Sin dependencias para evitar re-ejecuciones

  return {
    orders,
    missingOrders,
    operators,
    loading,
    error,
    pendingOrders,
    preparedOrders,
    inPreparationOrders,
    fetchAllOrders,
    fetchOrdersByStatus,
    fetchMissingOrders,
    fetchOperators,
    assignOperatorToOrder,
    reportOrderMissing,
    getOrderById,
    refetch
  };
};
