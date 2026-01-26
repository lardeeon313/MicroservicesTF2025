import { useState, useMemo } from 'react';
import { useInPreparationOrders } from '../hooks/useOrders';
import { DepotOrderDto } from '../types/OrderTypes';
import OrderTable from '../../billingmanager/components/OrderTable';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import BackButton from '../../../../components/BackButton';
import Pagination from '../components/Pagination';

function InPreparationOrdersPage() {
  const {
    orders,
    loading,
    error,
    refetch
  } = useInPreparationOrders();

  const [selectedOrder, setSelectedOrder] = useState<DepotOrderDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Convertir DepotOrderDto a OrderTableData para compatibilidad
    const convertToTableData = (order: DepotOrderDto) => ({
    id: order.depotOrderId,
    status: 'En Preparación',
    orderDate: order.orderDate ? order.orderDate.toString() : 'Sin fecha',
    deliveryDate: order.deliveryDate ? order.deliveryDate.toString() : undefined,
    deliveryDetail: order.deliveryDetail ?? '',
    customerFirstName: order.customerName?.split(' ')[0] || '',
    customerLastName: order.customerName?.split(' ').slice(1).join(' ') || '',
    operatorName: order.operatorName || '-',
    address: order.address
      ? {
          id: order.address.id,
          street: order.address.street,
          number: order.address.number,
          apartment: order.address.apartment,
          city: order.address.city,
          province: order.address.province,
          country: order.address.country,
          postalCode: order.address.postalCode,
          latitude: order.address.latitude,
          longitude: order.address.longitude,
          formattedAddress: order.address.formattedAddress
        }
      : undefined,
    items: Array.isArray(order.items)
      ? order.items.map((item: any) => ({
          productName: item.productName ?? '',
          productBrand: item.productBrand ?? '',
          quantity: item.quantity ?? 0
        }))
      : []
  });


  // Paginación
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return orders.slice(startIndex, endIndex);
  }, [orders, currentPage, itemsPerPage]);
  
  const tableData = paginatedOrders.map(convertToTableData);

  const handleView = (id: number) => {
    const order = orders.find((o: any) => (o as any).depotOrderId === id);
    setSelectedOrder(order || null);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando órdenes en preparación..." height='h-screen' />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Órdenes en Preparación</h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Visualiza las órdenes que están siendo preparadas por operarios asignados.
          </p>


          <div className="bg-white rounded-lg shadow overflow-hidden">
            <OrderTable
              orders={tableData}
              loading={loading}
              error={error}
              onRefetch={refetch}
              onView={handleView}
              activeTab="inPreparation"
              emptyMessageTitle="No hay órdenes en preparación"
              emptyMessageBody="Puedes asignar órdenes desde el módulo de órdenes pendientes."
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(orders.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              totalItems={orders.length}
              itemsPerPage={itemsPerPage}
            />
          </div>


          {/* Diálogo de detalles de orden */}
          {selectedOrder && (
            <>
              <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40" />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-red-600">Detalles de la Orden en Preparación</h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 space-y-10">
                    {/* Datos del cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Cliente:</label>
                        <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Pedido:</label>
                        <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
                          {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString("es-AR") : 'Sin fecha'}
                        </p>
                      </div>
                      <div className='md:col-span-2'>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Detalles de entrega:</label>
                        <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                          {selectedOrder.deliveryDetail || "No especificado"}
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Dirección:</label>
                        <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                          {selectedOrder.address
                            ? `${selectedOrder.address.street} , ${selectedOrder.address.number},${selectedOrder.address.apartment}, ${selectedOrder.address.city}, ${selectedOrder.address.province}`
                            : 'No especificado'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-4">Estado:</label>
                        <span className="rounded-lg border border-gray-300 bg-blue-100 px-3 py-2.5 font-semibold text-gray-900 shadow-sm">En Preparación</span>
                      </div>
                    </div>

                    {/* Tabla de productos */}
                    <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                          <tr>
                            <th className="px-4 py-3">Producto</th>
                            <th className="px-4 py-3">Marca</th>
                            <th className="px-4 py-3">Cantidad</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedOrder.items.map((item: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3">{item.productName}</td>
                              <td className="px-4 py-3">{item.productBrand}</td>
                              <td className="px-4 py-3">{item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className='mt-8'>
            <BackButton to="/depot/pending-orders" label='Ir a Órdenes Pendientes' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InPreparationOrdersPage; 