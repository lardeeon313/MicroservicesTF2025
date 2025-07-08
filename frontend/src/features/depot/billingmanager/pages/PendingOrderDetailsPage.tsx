import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPendingOrderDetails } from '../services/OrderService';
import { DepotOrderDto } from '../types/OrderTypes';
import { OrderStatus } from '../../depotmanager/types/OrderTypes';
import OrderDetails from '../components/OrderDetails';

function PendingOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<DepotOrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPendingOrderDetails(Number(id))
      .then(setOrder)
      .catch(() => setError('No se pudo cargar la orden.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Mapear a OrderTableData para OrderDetails
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

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Detalle de Orden Pendiente</h2>
      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && order && (
        <OrderDetails order={mapToOrderTableData(order)} />
      )}
    </div>
  );
}

export default PendingOrderDetailsPage; 