import { useState, useMemo } from 'react';
import { usePreparedOrders } from '../hooks/useOrders';
import { DepotOrderDto, OrderStatus } from '../types/OrderTypes';
import OrderTable from '../../billingmanager/components/OrderTable';
import OrderDetails from '../../billingmanager/components/OrderDetails';
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
  const convertToTableData = (order: any) => ({
    id: order.depotOrderId,
    status: 
      Number(order.status) === OrderStatus.Prepared
        ? 'Preparado'
        : Number(order.status) === OrderStatus.Invoiced
        ? 'Facturado'
        : 'Enviado a facturar',      
    orderDate: order.orderDate ? order.orderDate.toString() : 'Sin fecha',
    deliveryDate: order.deliveryDate ? order.deliveryDate.toString() : undefined,
    deliveryDetail: order.deliveryDetail ?? '',
    customerFirstName: order.customerName ? order.customerName.split(' ')[0] : '',
    customerLastName: order.customerName ? order.customerName.split(' ').slice(1).join(' ') : '',
    items: Array.isArray(order.items) ? order.items.map((item: any) => ({
      productName: item.productName ?? '',
      productBrand: item.productBrand ?? '',
      quantity: item.quantity ?? 0
    })) : []
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
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      Detalles de la Orden {activeTab === OrderStatus.Prepared ? 'Preparada' : 'Facturada'}
                    </h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <OrderDetails 
                    order={{
                      ...convertToTableData(selectedOrder), 
                      status: OrderStatus.Prepared ? 'Preparada' : 'Facturada'
                    }} 
                  />
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
