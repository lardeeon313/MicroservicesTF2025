
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderStatus } from '../types/OrderTypes';
import OrderTable from '../components/Order/OrderTable';
import Tabs from '../components/Order/Tabs';
import { useOrdersByStatus, useOrderOperations } from '../hooks/useOrders';
import BackButton from '../../../components/BackButton';
import toast from 'react-hot-toast';

const OrdersInRoutePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'onTheWay' | 'delivered' | 'pendingCash' | 'cashVerified'>('onTheWay');

  // Hooks para obtener órdenes por estado
  const onTheWayOrders = useOrdersByStatus(OrderStatus.OnTheWay);
  const deliveredOrders = useOrdersByStatus(OrderStatus.Delivered);
  const pendingCashOrders = useOrdersByStatus(OrderStatus.PendingCashVerification);
  const cashVerifiedOrders = useOrdersByStatus(OrderStatus.CashVerified);
  
  // Hook para operaciones de órdenes
  const { checkCashOrder } = useOrderOperations();

  const handleViewOrder = (orderId: number) => {
    navigate(`/verification/orders-in-route/${orderId}`);
  };

  const handleVerifyCash = async (orderId: number) => {
    try {
      const success = await checkCashOrder(orderId);
      if (success) {
        toast.success('Efectivo verificado correctamente');
        // Recargar las órdenes para actualizar la vista
        pendingCashOrders.refetch();
        cashVerifiedOrders.refetch();
      } else {
        toast.error('Error al verificar el efectivo');
      }
    } catch (error) {
      toast.error('Error al verificar el efectivo');
    }
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as 'onTheWay' | 'delivered' | 'pendingCash' | 'cashVerified');
  };

  const getCurrentOrders = () => {
    switch (activeTab) {
      case 'onTheWay':
        return onTheWayOrders;
      case 'delivered':
        return deliveredOrders;
      case 'pendingCash':
        return pendingCashOrders;
      case 'cashVerified':
        return cashVerifiedOrders;
      default:
        return onTheWayOrders;
    }
  };

  const currentOrders = getCurrentOrders();

  const tabs = [
    {
      key: 'onTheWay',
      label: 'En Camino',
      count: onTheWayOrders.loading ? undefined : onTheWayOrders.orders.length
    },
    {
      key: 'delivered',
      label: 'Entregado',
      count: deliveredOrders.loading ? undefined : deliveredOrders.orders.length
    },
    {
      key: 'pendingCash',
      label: 'Efectivo pendiente de verificación',
      count: pendingCashOrders.loading ? undefined : pendingCashOrders.orders.length
    },
    {
      key: 'cashVerified',
      label: 'Efectivo Verificado',
      count: cashVerifiedOrders.loading ? undefined : cashVerifiedOrders.orders.length
    }
  ];

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'onTheWay':
        return {
          title: 'No Hay Órdenes en Camino',
          body: 'No se encontraron órdenes que estén siendo entregadas actualmente.'
        };
      case 'delivered':
        return {
          title: 'No Hay Órdenes Entregadas',
          body: 'No se encontraron órdenes que hayan sido entregadas.'
        };
      case 'pendingCash':
        return {
          title: 'No Hay Efectivo Pendiente',
          body: 'No se encontraron órdenes con pago en efectivo pendientes de verificación.'
        };
      case 'cashVerified':
        return {
          title: 'No Hay Efectivo Verificado',
          body: 'No se encontraron órdenes con pago en efectivo ya verificadas.'
        };
      default:
        return {
          title: 'No Hay Órdenes',
          body: 'Actualmente no hay órdenes disponibles.'
        };
    }
  };

  const emptyMessage = getEmptyMessage();

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Órdenes en Ruta
          </h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Gestiona las órdenes que están siendo entregadas y verifica pagos en efectivo
          </p>

          {/* Pestañas */}
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={handleTabChange}
          />

          {/* Tabla de órdenes */}
          <OrderTable
            orders={currentOrders.orders}
            loading={currentOrders.loading}
            error={currentOrders.error}
            onRefetch={currentOrders.refetch}
            onView={handleViewOrder}
            activeTab="assigned"
            emptyMessageTitle={emptyMessage.title}
            emptyMessageBody={emptyMessage.body}
            onVerifyCash={activeTab === 'pendingCash' ? handleVerifyCash : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersInRoutePage;
