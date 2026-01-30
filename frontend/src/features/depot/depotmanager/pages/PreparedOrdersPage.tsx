import { useState, useMemo } from 'react';
import { usePreparedOrders } from '../hooks/useOrders';
import { DepotOrderDto, OrderStatus } from '../types/OrderTypes';
import OrderTable from '../../billingmanager/components/OrderTable';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import BackButton from '../../../../components/BackButton';
import Pagination from '../components/Pagination';
import OrderTabs from '../../../../components/OrderTabs';
import { BadgeCheck, CalendarDays, CircleDollarSign, MapPin, Package, User } from 'lucide-react';

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
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                  
                  {/* Header del modal */}
                  <div className={`bg-gradient-to-r px-8 py-6 flex justify-between items-center ${
                    activeTab === OrderStatus.Prepared
                      ? 'from-green-600 to-green-700'
                      : activeTab === OrderStatus.Invoiced
                      ? 'from-emerald-600 to-emerald-700'
                      : 'from-purple-600 to-purple-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Package className="w-8 h-8 text-white" />
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Detalles de la Orden {activeTab === OrderStatus.Prepared ? 'Preparada' : activeTab === OrderStatus.Invoiced ? 'Facturada' : 'Enviada a Facturar'}
                        </h2>
                        <p className={`text-sm ${
                          activeTab === OrderStatus.Prepared
                            ? 'text-green-100'
                            : activeTab === OrderStatus.Invoiced
                            ? 'text-emerald-100'
                            : 'text-purple-100'
                        }`}>
                          Orden V-{(selectedOrder as any).depotOrderId || selectedOrder.depotOrderId}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Contenido scrolleable */}
                  <div className="overflow-y-auto flex-1 px-8 py-6">
                    <div className="space-y-8">
                      
                      {/* Sección: Información General */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <User className={`w-5 h-5 ${
                            activeTab === OrderStatus.Prepared
                              ? 'text-green-600'
                              : activeTab === OrderStatus.Invoiced
                              ? 'text-emerald-600'
                              : 'text-purple-600'
                          }`} />
                          <h3 className="text-lg font-semibold text-gray-800">Información General</h3>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Cliente
                              </label>
                              <p className="text-gray-900 font-medium text-base">
                                {selectedOrder.customerName}
                              </p>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Fecha de Pedido
                              </label>
                              <div className="flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-gray-400" />
                                <p className="text-gray-900 font-medium text-base">
                                  {selectedOrder.orderDate 
                                    ? new Date(selectedOrder.orderDate).toLocaleDateString("es-AR", {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })
                                    : 'Sin fecha'}
                                </p>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Estado Actual
                              </label>
                              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-sm border-2 ${
                                activeTab === OrderStatus.Prepared
                                  ? 'bg-green-100 text-green-800 border-green-300'
                                  : activeTab === OrderStatus.Invoiced
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-purple-100 text-purple-800 border-purple-300'
                              }`}>
                                <BadgeCheck className="w-4 h-4" />
                                <span>
                                  {activeTab === OrderStatus.Prepared
                                    ? 'Preparada'
                                    : activeTab === OrderStatus.Invoiced
                                    ? 'Facturada'
                                    : 'Enviada a Facturar'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sección: Detalles de Entrega */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className={`w-5 h-5 ${
                            activeTab === OrderStatus.Prepared
                              ? 'text-green-600'
                              : activeTab === OrderStatus.Invoiced
                              ? 'text-emerald-600'
                              : 'text-purple-600'
                          }`} />
                          <h3 className="text-lg font-semibold text-gray-800">Detalles de Entrega</h3>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Dirección de Entrega
                              </label>
                              <p className="text-gray-900 text-base leading-relaxed">
                                {selectedOrder.address
                                  ? `${selectedOrder.address.street} ${selectedOrder.address.number}${
                                      selectedOrder.address.apartment ? `, ${selectedOrder.address.apartment}` : ''
                                    }, ${selectedOrder.address.city}, ${selectedOrder.address.province}`
                                  : 'No especificado'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Instrucciones Especiales
                              </label>
                              <p className="text-gray-900 text-base leading-relaxed">
                                {selectedOrder.deliveryDetail || "No especificado"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sección: Productos */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Package className={`w-5 h-5 ${
                            activeTab === OrderStatus.Prepared
                              ? 'text-green-600'
                              : activeTab === OrderStatus.Invoiced
                              ? 'text-emerald-600'
                              : 'text-purple-600'
                          }`} />
                          <h3 className="text-lg font-semibold text-gray-800">Productos</h3>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                  Producto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                  Marca
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                  Cantidad
                                </th>
                                {activeTab === OrderStatus.Invoiced && (
                                  <>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                      Precio Unitario
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                      Subtotal
                                    </th>
                                  </>
                                )}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {selectedOrder.items.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 text-gray-900 font-medium">
                                    {item.productName}
                                  </td>
                                  <td className="px-6 py-4 text-gray-700">
                                    {item.productBrand}
                                  </td>
                                  <td className="px-6 py-4 text-gray-700">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${
                                      activeTab === OrderStatus.Prepared
                                        ? 'bg-green-100 text-green-800'
                                        : activeTab === OrderStatus.Invoiced
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-purple-100 text-purple-800'
                                    }`}>
                                      {item.quantity}
                                    </span>
                                  </td>
                                  {activeTab === OrderStatus.Invoiced && (
                                    <>
                                      <td className="px-6 py-4 font-medium text-gray-800">
                                        ${(item.unitPrice || 0).toFixed(2)}
                                      </td>
                                      <td className="px-6 py-4 font-semibold text-gray-900">
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
                          <div className="mt-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <CircleDollarSign className="w-6 h-6 text-emerald-700" />
                                <span className="text-lg font-bold text-gray-800">Total de la Orden:</span>
                              </div>
                              <span className="text-3xl font-bold text-emerald-700">
                                ${selectedOrder.items.reduce((acc: number, item: any) => {
                                  return acc + ((item.unitPrice || 0) * item.quantity);
                                }, 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Footer con botón de cerrar */}
                  <div className="border-t border-gray-200 px-8 py-5 bg-gray-50">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className={`px-6 py-2.5 bg-gradient-to-r text-white rounded-lg font-semibold 
                                  transition-all shadow-md hover:shadow-lg ${
                          activeTab === OrderStatus.Prepared
                            ? 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                            : activeTab === OrderStatus.Invoiced
                            ? 'from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
                            : 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                        }`}
                      >
                        Cerrar
                      </button>
                    </div>
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