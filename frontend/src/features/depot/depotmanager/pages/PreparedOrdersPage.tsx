import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { DepotOrderDto } from '../types/OrderTypes';
import OrderTable from '../../billingmanager/components/OrderTable';
import OrderDetails from '../../billingmanager/components/OrderDetails';
import LoadingSpinner from '../../../../components/LoadingSpinner';

function PreparedOrdersPage() {
  const {
    preparedOrders,
    loading,
    error,
    refetch
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<DepotOrderDto | null>(null);

  // Convertir DepotOrderDto a OrderTableData para compatibilidad
  const convertToTableData = (order: DepotOrderDto) => ({
    id: order.DepotOrderId,
    status: order.Status,
    orderDate: order.OrderDate.toString(),
    deliveryDetail: order.DeliveryDetail,
    customerFirstName: order.CustomerName.split(' ')[0] || '',
    customerLastName: order.CustomerName.split(' ').slice(1).join(' ') || '',
    items: order.Items.map(item => ({
      productName: item.ProductName,
      productBrand: item.ProductBrand,
      quantity: item.Quantity
    }))
  });

  const tableData = preparedOrders.map(convertToTableData);

  const handleView = (id: number) => {
    const order = preparedOrders.find(o => o.DepotOrderId === id);
    setSelectedOrder(order || null);
  };

  const handleActionChange = (action: string, id: number) => {
    // Sin acciones específicas para pedidos preparados
    console.log('Acción no implementada:', action, id);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando órdenes preparadas..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Órdenes Preparadas</h1>
          <p className="mt-2 text-gray-600">
            Visualiza las órdenes que ya están preparadas y listas para continuar
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <OrderTable
          orders={tableData}
          loading={loading}
          error={error}
          onRefetch={refetch}
          onView={handleView}
          showEditButton={false}
          showDeleteButton={false}
          showStatusChange={false}
          onActionChange={handleActionChange}
        />

        {/* Diálogo de detalles de orden */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Detalles de la Orden Preparada</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <OrderDetails order={convertToTableData(selectedOrder)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreparedOrdersPage;
