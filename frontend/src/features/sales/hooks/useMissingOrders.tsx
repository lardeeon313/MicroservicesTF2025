import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  OrderMissingDto,
  UpdateOrderRequest,
  OrderReissuedRequest,
  CancelOrderRequest,
} from '../types/OrderTypes';
import { cancelOrder, getAllMissingOrders, getMissingOrderById, reissueOrder, updateMissingOrder } from '../services/OrderService';
import { handleFormikError } from '../../../components/ErrorHandler';

export const useMissingOrders = () => {
  const [orders, setOrders] = useState<OrderMissingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // El filtro de estado se lee de la URL (query parameter)
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status') || 'pendingResolution';

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const allOrders = await getAllMissingOrders();
      // Filtramos en el frontend según el status (para simplificar la API)
      const filteredOrders = allOrders.filter(
        (order) => order.salesOrder.status === statusFilter
      );
      setOrders(filteredOrders);
    } catch (err) {
        handleFormikError({ error: err });
        setError('Hubo un error al cargar las órdenes con faltantes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]); // Recargar cada vez que el filtro cambie en la URL

  const handleUpdate = async (
    id: number,
    data: UpdateOrderRequest
  ): Promise<void> => {
    try {
      await updateMissingOrder(id, data);
      toast.success('Orden modificada exitosamente.');
      navigate('/sales/missing-orders?status=PendingReissued');
    } catch (err) {
      handleFormikError({ error: err, customMessages: {
        404: 'La orden no fue encontrada.',
        400: 'Los datos proporcionados son inválidos.'
      }});
      throw err;
    }
  };

  const handleReissue = async (data: OrderReissuedRequest): Promise<void> => {
    try {
      await reissueOrder(data);
      toast.success('Orden reemitida exitosamente.');
      fetchOrders(); // Refrescar la grilla para que la orden desaparezca
    } catch (err) {
      handleFormikError({ error: err, customMessages: {
        404: 'La orden no fue encontrada.',
        400: 'No se pudo reemitir la orden con los datos proporcionados.'
      }});
      throw err;
    }
  };

  const handleCancel = async (id: number, reason: string): Promise<void> => {
    try {
      const data: CancelOrderRequest = { orderId: id, reason };
      await cancelOrder(id, data);
      toast.success('Orden cancelada exitosamente.');
      fetchOrders(); // Refrescar la grilla para que la orden desaparezca
    } catch (err) {
      handleFormikError({ error: err, customMessages: {
        404: 'La orden no fue encontrada.',
        409: 'La orden no puede ser cancelada en su estado actual.'
      }});
      throw err;
    }
  };

  const handleSearch = async (id: number): Promise<OrderMissingDto | null> => {
    try {
      const order = await getMissingOrderById(id);
      toast.success('Faltante encontrado.');
      return order;
    } catch (err) {
      handleFormikError({ error: err, customMessages: {
        404: 'No se encontró el faltante con ese ID.'
      }});
      return null;
    }
  };

  return {
    orders,
    loading,
    error,
    statusFilter,
    fetchOrders,
    handleUpdate,
    handleReissue,
    handleCancel,
    handleSearch,
  };
};