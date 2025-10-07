import { useState, useMemo } from 'react';
import { usePreparedOrders } from '../hooks/useOrders';
import { DepotOrderDto, OrderStatus } from '../types/OrderTypes';
import OrderTable from '../../billingmanager/components/OrderTable';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import BackButton from '../../../../components/BackButton';
import Pagination from '../components/Pagination';
import OrderTabs from '../../../../components/OrderTabs';

function PreparedOrdersPage() {
  const {
    orders,
    loading,
    error,
    refetch
  } = usePreparedOrders();

  const [selectedOrder, setSelectedOrder] = useState<DepotOrderDto | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.Prepared);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Convertir DepotOrderDto a OrderTableData para compatibilidad
  const convertToTableData = (order: DepotOrderDto) => ({
    id: order.depotOrderId,
    status:
      Number(order.status) === OrderStatus.Prepared
        ? 'Preparado'
        : Number(order.status) === OrderStatus.Invoiced
        ? 'Facturado'
        : 'Enviado a Facturar',
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
      ? order.items.map((item) => ({
          productName: item.productName ?? '',
          productBrand: item.productBrand ?? '',
          quantity: item.quantity ?? 0,
          unitPrice: item.unitPrice ?? 0 // si aplica para facturadas
        }))
      : [],
    total: order.totalAmount ?? 0
  });


  const filteredOrders = useMemo(() => {
    return orders.filter((order) => order.status === activeTab);
  }, [orders, activeTab]);
  
  // Paginación
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, itemsPerPage]);
  
  const tableData = paginatedOrders.map(convertToTableData);
  
  const handleTabChange = (status: OrderStatus) => {
    setActiveTab(status);
    setCurrentPage(1);
  };

  const handleView = (id: number) => {
    const order = filteredOrders.find((o: any) => (o as any).depotOrderId === id);
    setSelectedOrder(order || null);
  };

  const emptyMessageTitle =
    activeTab === OrderStatus.Prepared
      ? 'No hay órdenes preparadas'
      : activeTab === OrderStatus.Invoiced
      ? 'No hay órdenes facturadas'
      : 'No hay órdenes enviadas a facturar';

  const emptyMessageBody =
    activeTab === OrderStatus.Prepared
      ? 'Aún no se ha terminado de preparar ninguna orden.'
      : activeTab === OrderStatus.Invoiced
      ? 'Aún no se ha facturado ninguna orden.'
      : 'Aún no se ha enviado ninguna orden a facturación.';


  if (loading) {
    return <LoadingSpinner message="Cargando órdenes armadas..." height='h-screen' />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Órdenes Preparadas</h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Visualiza las órdenes que han sido preparadas y facturadas
          </p>

          {/* ✅ Pestañas usando OrderTabs */}
          <OrderTabs
            activeStatus={activeTab}
            onChange={handleTabChange}
            tabs={[
              {
                status: OrderStatus.Prepared,
                label: "Preparadas",
                count: orders.filter((order: any) => Number(order.status) === OrderStatus.Prepared).length,
              },
              {
                status: OrderStatus.Invoiced,
                label: "Facturadas",
                count: orders.filter((order: any) => Number(order.status) === OrderStatus.Invoiced).length,
              },
              {
                status: OrderStatus.SentToBilling,
                label: "Enviadas a facturar",
                count: orders.filter((order: any) => Number(order.status) === OrderStatus.SentToBilling).length,
              },
            ]}
          />

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <OrderTable
              orders={tableData}
              loading={loading}
              onRefetch={refetch}
              onView={handleView}
              error={error}
              activeTab={activeTab === OrderStatus.Prepared
                ? "prepared"
                : activeTab === OrderStatus.Invoiced
                ? "invoiced"
                : "sentToBilling"}
              emptyMessageTitle={emptyMessageTitle}
              emptyMessageBody={emptyMessageBody}
            />
            
            {!loading && !error && filteredOrders.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                totalItems={filteredOrders.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>

          {/* Diálogo de detalles de orden */}
          {selectedOrder && (
            <>
              <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40" />
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-red-600">
                      Detalles de la Orden {activeTab === OrderStatus.Prepared ? 'Preparada' : activeTab === OrderStatus.Invoiced ? 'Facturada' : 'Enviada a Facturar'}
                    </h2>
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
                        <span className={`rounded-lg border border-gray-300 px-3 py-2.5 font-semibold text-gray-900 shadow-sm ${
                          activeTab === OrderStatus.Prepared
                            ? 'bg-green-100'
                            : activeTab === OrderStatus.Invoiced
                            ? 'bg-green-100'
                            : 'bg-purple-100'
                        }`}>
                          {activeTab === OrderStatus.Prepared
                            ? 'Preparada'
                            : activeTab === OrderStatus.Invoiced
                            ? 'Facturada'
                            : 'Enviada a Facturar'}
                        </span>
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
                            {activeTab === OrderStatus.Invoiced && (
                              <>
                                <th className="px-4 py-3">Precio Unitario</th>
                                <th className="px-4 py-3">Subtotal</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedOrder.items.map((item: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3">{item.productName}</td>
                              <td className="px-4 py-3">{item.productBrand}</td>
                              <td className="px-4 py-3">{item.quantity}</td>
                              {activeTab === OrderStatus.Invoiced && (
                                <>
                                  <td className="px-4 py-3 font-medium text-gray-800">
                                    ${item.unitPrice || 0}
                                  </td>
                                  <td className="px-4 py-3 font-semibold text-gray-900">
                                    ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Total - Solo para órdenes facturadas */}
                    {activeTab === OrderStatus.Invoiced && (
                      <div className="flex justify-end items-center gap-4 mt-4">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-2xl font-bold text-green-700">
                          ${selectedOrder.items.reduce((acc: number, item: any) => {
                            return acc + ((item.unitPrice || 0) * item.quantity);
                          }, 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreparedOrdersPage;