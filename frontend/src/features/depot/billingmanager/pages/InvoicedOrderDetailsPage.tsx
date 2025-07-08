import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInvoicedOrderById } from '../services/OrderService';
import { DepotOrderDto } from '../types/OrderTypes';
import { OrderStatus } from '../../depotmanager/types/OrderTypes';
import OrderDetails from '../components/OrderDetails';
import EditUnitPriceModal from '../components/EditUnitPriceModal';

function InvoicedOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<DepotOrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchOrder = () => {
    if (!id) return;
    setLoading(true);
    getInvoicedOrderById(Number(id))
      .then(setOrder)
      .catch(() => setError('No se pudo cargar la orden.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
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
      unitPrice: item.UnitPrice,
    })),
    total: order.TotalAmount,
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Detalle de Orden Facturada</h2>
      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && order && (
        <div>
          <OrderDetails order={mapToOrderTableData(order)} />
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Ítems</h3>
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Producto</th>
                  <th className="px-4 py-2 text-left">Marca</th>
                  <th className="px-4 py-2 text-left">Cantidad</th>
                  <th className="px-4 py-2 text-left">Precio Unitario</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {order.Items.map((item) => (
                  <tr key={item.Id}>
                    <td className="px-4 py-2">{item.ProductName}</td>
                    <td className="px-4 py-2">{item.ProductBrand}</td>
                    <td className="px-4 py-2">{item.Quantity}</td>
                    <td className="px-4 py-2">${item.UnitPrice?.toFixed(2) ?? '-'}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowModal(true);
                        }}
                      >
                        Editar precio
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {order && selectedItem && (
        <EditUnitPriceModal
          orderId={order.DepotOrderId}
          item={selectedItem}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchOrder}
        />
      )}
    </div>
  );
}

export default InvoicedOrderDetailsPage; 