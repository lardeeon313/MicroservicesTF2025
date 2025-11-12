
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePendingVerificationOrders, useAssignedDeliveryOrders, useVerifiedOrders, useAssignmentCancelledOrders, useOrderDetails } from '../hooks/useOrders';
// import { useOperators } from '../hooks/useOperators'; // Para uso futuro
import OrderTable from '../components/Order/OrderTable';
import Tabs from '../components/Order/Tabs';
import BackButton from '../../../components/BackButton';
import RejectionReasonsModal from '../components/Order/RejectionReasonsModal';

const PendingOrdersVerificationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'assigned' | 'rejected'>('pending');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  // Hooks para obtener las órdenes
  const pendingOrders = usePendingVerificationOrders();
  const verifiedOrders = useVerifiedOrders();
  const assignedOrders = useAssignedDeliveryOrders();
  const rejectedOrders = useAssignmentCancelledOrders();
  
  // Hook para obtener detalles de la orden seleccionada
  const { order: selectedOrder } = useOrderDetails(selectedOrderId || undefined);

  const handleViewOrder = (orderId: number) => {
    navigate(`/verification/pending-orders-verification/${orderId}`);
  };

  const handleViewRejectionReasons = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsRejectionModalOpen(true);
  };

  const handleCloseRejectionModal = () => {
    setIsRejectionModalOpen(false);
    setSelectedOrderId(null);
    // Recargar las órdenes para actualizar la vista después de cerrar el modal
    rejectedOrders.refetch();
    pendingOrders.refetch();
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as 'pending' | 'verified' | 'assigned' | 'rejected');
  };

  const getCurrentOrders = () => {
    switch (activeTab) {
      case 'pending':
        return pendingOrders;
      case 'verified':
        return verifiedOrders;
      case 'assigned':
        return assignedOrders;
      case 'rejected':
        return rejectedOrders;
      default:
        return pendingOrders;
    }
  };

  const currentOrders = getCurrentOrders();

  const tabs = [
    {
      key: 'pending',
      label: 'Pendientes de Verificación',
      count: pendingOrders.loading ? undefined : pendingOrders.orders.length
    },
    {
      key: 'verified',
      label: 'Verificadas',
      count: verifiedOrders.loading ? undefined : verifiedOrders.orders.length
    },
    {
      key: 'assigned',
      label: 'Asignadas a Reparto',
      count: assignedOrders.loading ? undefined : assignedOrders.orders.length
    },
    {
      key: 'rejected',
      label: 'Asignación Rechazada',
      count: rejectedOrders.loading ? undefined : rejectedOrders.orders.length
    }
  ];

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'pending':
        return {
          title: 'No Hay Órdenes Pendientes de Verificación',
          body: 'Todas las órdenes han sido procesadas. Estas órdenes requieren establecer prioridad, verificación y asignación de operador.'
        };
      case 'verified':
        return {
          title: 'No Hay Órdenes Verificadas',
          body: 'No se encontraron órdenes en estado verificado a la espera de asignación.'
        };
      case 'assigned':
        return {
          title: 'No Hay Órdenes Asignadas a Reparto',
          body: 'No se encontraron órdenes asignadas a operadores para entrega.'
        };
      case 'rejected':
        return {
          title: 'No Hay Órdenes con Asignación Rechazada',
          body: 'No se encontraron órdenes que hayan sido rechazadas por los operadores. Estas órdenes pueden ser reasignadas.'
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
            Gestión de Órdenes Logísticas
          </h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Administrá las órdenes en diferentes estados del proceso de verificación
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
            activeTab={activeTab}
            emptyMessageTitle={emptyMessage.title}
            emptyMessageBody={emptyMessage.body}
            onViewRejectionReasons={activeTab === 'rejected' ? handleViewRejectionReasons : undefined}
          />
        </div>
      </div>

      {/* Modal de motivos de cancelación */}
      <RejectionReasonsModal
        order={selectedOrder}
        isOpen={isRejectionModalOpen}
        onClose={handleCloseRejectionModal}
      />
    </div>
  );
};

export default PendingOrdersVerificationPage;
