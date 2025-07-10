import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingBillingOrders, invoiceOrder } from '../services/OrderService';
import { DepotOrderDto, OrderStatus } from '../types/OrderTypes';
import AssignPricesModal from '../components/AssignPricesModal';
import OrderTable from '../components/OrderTable';
import { OrderTableData } from '../../depotmanager/types/OrderTypes';

const PendingOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<DepotOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DepotOrderDto | null>(null);
  const [factureError, setFactureError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    getPendingBillingOrders()
      .then(setOrders)
      .catch(() => setError('Error al cargar las órdenes pendientes de facturación.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAssignPrices = (order: DepotOrderDto) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleModalSuccess = () => {
    fetchOrders();
  };

  const handleInvoiceOrder = async (orderId: number) => {
    setFactureError(null);
    try {
      await invoiceOrder(orderId);
      fetchOrders();
    } catch {
      setFactureError('Error al facturar la orden.');     
    }
  };

  // Adaptar DepotOrderDto a OrderTableData
  const mapToOrderTableData = (order: DepotOrderDto) => ({
    id: order.DepotOrderId,
    customerFirstName: order.CustomerName,
    customerLastName: '',
    orderDate: order.OrderDate,
    deliveryDate: '',
    deliveryDetail: order.DeliveryDetail,
    status: order.Status as OrderStatus,
    items: order.Items.map(item => ({
      id: item.Id,
      productName: item.ProductName,
      productBrand: item.ProductBrand,
      quantity: item.Quantity,
    })),
    total: order.TotalAmount,
  });

  const orderTableData = orders.map(mapToOrderTableData);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Órdenes Pendientes de Facturación</h2>
      {factureError && <div className="text-red-500 mb-2">{factureError}</div>}
      <OrderTable
        orders={orderTableData as OrderTableData[]}
        loading={loading}
        error={error}
        onRefetch={fetchOrders}
        onView={(id) => navigate(`/depot/billingmanager/pending-orders/${id}`)}
        onActionChange={(action, id) => {
          if (action === 'invoice') {
            handleInvoiceOrder(id);
          } else {
            const order = orders.find(o => o.DepotOrderId === id);
            if (order) handleAssignPrices(order);
          }
        }}
        showEditButton={false}
        showDeleteButton={false}
        showStatusChange={false}
        customActions={[]}
      />
      {selectedOrder && (
        <AssignPricesModal
          order={selectedOrder}
          isOpen={showModal}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default PendingOrdersPage; 