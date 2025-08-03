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

// Función auxiliar para manejar errores específicos
const handleOrderError = (err: unknown, defaultMessage: string): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosError = err as any;
    const status = axiosError.response?.status;
    
    // Manejo específico para errores 500 (servidor sin órdenes)
    if (status === 500) {
      return 'No hay órdenes disponibles en el sistema. Verifique la conexión con el microservicio de ventas.';
    }
    
    // Manejo para errores 404 (no encontrado)
    if (status === 404) {
      return 'No se encontraron órdenes con los criterios especificados.';
    }
    
    // Manejo para errores de red
    if (status === 0 || !status) {
      return 'Error de conexión. Verifique la conectividad con el servidor.';
    }
    
    // Otros errores HTTP
    return `Error del servidor (${status}): ${defaultMessage}`;
  }
  
  // Error genérico
  return err instanceof Error ? err.message : defaultMessage;
};

// Mapeo de status numérico a string

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<DepotOrderDto[]>([]);
  const [missingOrders, setMissingOrders] = useState<DepotOrderMissingDto[]>([]);
  const [operators, setOperators] = useState<OperatorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtrar órdenes por estado
  const pendingOrders = orders.filter(order => order.status === OrderStatus.Issued);
  const preparedOrders = orders.filter(order => order.status === OrderStatus.Prepared);
  const inPreparationOrders = orders.filter(order => order.status === OrderStatus.InPreparation);

  const fetchAllOrders = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllOrders();
      setOrders(data);
      
      // Si no hay órdenes pero no hay error, mostrar mensaje informativo
      if (data.length === 0) {
        setError('No hay órdenes pendientes en el sistema. Las órdenes se sincronizan automáticamente desde el módulo de ventas.');
      }
    } catch (err) {
      console.error('Error fetching all orders:', err);
      const errorMessage = handleOrderError(err, 'Error al cargar las órdenes');
      setError(errorMessage);
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
        const otherOrders = prevOrders.filter(order => order.status !== status);
        return [...otherOrders, ...data];
      });
      
      // Si no hay órdenes para este estado específico
      if (data.length === 0) {
        setError(`No hay órdenes con estado "${status}" disponibles.`);
      }
    } catch (err) {
      console.error('Error fetching orders by status:', err);
      const errorMessage = handleOrderError(err, 'Error al cargar las órdenes por estado');
      setError(errorMessage);
    }
  }, []);

  const fetchMissingOrders = useCallback(async () => {
    try {
      setError(null);
      const data = await getMissingOrders();
      setMissingOrders(data);
      
      // Si no hay órdenes con faltantes
      if (data.length === 0) {
        // No establecer error aquí ya que es normal no tener faltantes
        console.log('No hay órdenes con faltantes reportados.');
      }
    } catch (err) {
      console.error('Error fetching missing orders:', err);
      const errorMessage = handleOrderError(err, 'Error al cargar las órdenes con faltantes');
      setError(errorMessage);
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
      const errorMessage = handleOrderError(err, 'Error al cargar los operadores');
      setError(errorMessage);
      // En caso de error, establecer un array vacío
      setOperators([]);
    }
  }, []);

  const assignOperatorToOrder = useCallback(async (orderId: number, operatorUserId: string) => {
    try {
      setError(null);
      const request: AssignOrderRequest = { 
        depotOrderId: orderId,
        operatorUserId: operatorUserId 
      };
      await assignOperator(orderId, request);
      // Recargar órdenes después de asignar
      await fetchAllOrders();
    } catch (err) {
      console.error('Error assigning operator:', err);
      const errorMessage = handleOrderError(err, 'Error al asignar operador');
      setError(errorMessage);
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
      const errorMessage = handleOrderError(err, 'Error al reportar orden faltante');
      setError(errorMessage);
      throw err;
    }
  }, [fetchAllOrders, fetchMissingOrders]);

  const getOrderById = useCallback(async (orderId: number): Promise<DepotOrderEntity> => {
    try {
      setError(null);
      return await getOrderByIdService(orderId);
    } catch (err) {
      console.error('Error getting order by id:', err);
      const errorMessage = handleOrderError(err, 'Error al obtener la orden');
      setError(errorMessage);
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

// Hook para traer solo órdenes en preparación (estado 3)
export const useInPreparationOrders = () => {
  const [orders, setOrders] = useState<DepotOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Traer solo órdenes en preparación
  const fetchInPreparationOrders = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getOrdersByStatus('3');
      console.log('Órdenes en preparación recibidas:', data);
      setOrders(data);
      
      if (data.length === 0) {
        setError('No hay órdenes en preparación disponibles.');
      }
    } catch (err) {
      console.error('Error fetching in preparation orders:', err);
      const errorMessage = handleOrderError(err, 'Error al cargar las órdenes en preparación');
      setError(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchInPreparationOrders();
  }, [fetchInPreparationOrders]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchInPreparationOrders();
  }, [fetchInPreparationOrders]);

  return {
    orders,
    loading,
    error,
    refetch
  };
};

// Hook para traer órdenes preparadas y facturadas (estados 7 y 8)
export const usePreparedOrders = () => {
  const [orders, setOrders] = useState<DepotOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Traer órdenes preparadas y facturadas
  const fetchPreparedOrders = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Traer órdenes preparadas (estado 7)
      const preparedData = await getOrdersByStatus('7');
      console.log('Órdenes preparadas recibidas:', preparedData);
      
      // Traer órdenes facturadas (estado 8)
      const invoicedData = await getOrdersByStatus('8');
      console.log('Órdenes facturadas recibidas:', invoicedData);
      
      // Combinar ambas listas
      const combinedData = [...preparedData, ...invoicedData];
      setOrders(combinedData);
      
      if (combinedData.length === 0) {
        setError('No hay órdenes preparadas o facturadas disponibles.');
      }
    } catch (err) {
      console.error('Error fetching prepared/invoiced orders:', err);
      const errorMessage = handleOrderError(err, 'Error al cargar las órdenes preparadas y facturadas');
      setError(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchPreparedOrders();
  }, [fetchPreparedOrders]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchPreparedOrders();
  }, [fetchPreparedOrders]);

  return {
    orders,
    loading,
    error,
    refetch
  };
};

// Hook para traer órdenes pendientes, asignadas y re emitidas(estados 0, 1 y 2) y operadores
export const fetchPendingOrders = () => {
  const [orders, setOrders] = useState<DepotOrderDto[]>([]);
  const [operators, setOperators] = useState<OperatorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Traer órdenes pendientes y asignadas
  const fetchPendingOrders = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Intentar usar el endpoint específico por estado, si falla usar el general
      let pendingData: any[] = [];
      let assignedData: any[] = [];
      let rereceivedData: any[] = [];
      
      try {
        // Traer órdenes pendientes (estado 0)
        pendingData = await getOrdersByStatus('0');
      } catch (error) {
        // Si falla, usar el endpoint general y filtrar
        const allOrders = await getAllOrders();
        pendingData = allOrders.filter((order: any) => Number(order.status) === 0);
      }

      try {
        // Traer órdenes re emitidas (estado 1)
        rereceivedData = await getOrdersByStatus('1');
      } catch {
        const allOrders = await getAllOrders();
        rereceivedData = allOrders.filter(order => Number(order.status) === 1);
      }
      
      try {
        // Traer órdenes asignadas (estado 2)
        assignedData = await getOrdersByStatus('2');
      } catch (error) {
        // Si falla, usar el endpoint general y filtrar
        const allOrders = await getAllOrders();
        assignedData = allOrders.filter((order: any) => Number(order.status) === 2);
      }
      
      // Combinar listas
      const combinedData = [...pendingData, ...assignedData, ...rereceivedData];

      setOrders(combinedData);
      
    } catch (err) {
      let errorMessage = 'Error al cargar las ordenes';
      
      // Verificar si es un error específico del backend
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        if (axiosError.response?.status === 500) {
          errorMessage = 'Error interno del servidor. El backend no puede procesar la solicitud.';
        } else if (axiosError.response?.status === 404) {
          errorMessage = 'Endpoint no encontrado. Verifique que el backend esté funcionando correctamente.';
        } else if (axiosError.response?.status) {
          errorMessage = `Error del servidor: ${axiosError.response.status} - ${axiosError.response.statusText}`;
        }
      }
      
      setError(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOperators = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllOperators();
      setOperators(data);
    } catch (err) {
      const errorMessage = handleOrderError(err, 'Error al cargar los operadores');
      setError(errorMessage);
      setOperators([]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchPendingOrders(),
      fetchOperators()
    ]).finally(() => setLoading(false));
  }, [fetchPendingOrders, fetchOperators]);

  const refetchOrders = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await fetchPendingOrders();
  }, [fetchPendingOrders]);

  return {
    orders,
    operators,
    loading,
    error,
    refetch: () => {
      fetchPendingOrders();
      fetchOperators();
    },
    refetchOrders
  };
};
