import { useState, useMemo } from 'react';
import { usePreparedOrders } from '../hooks/useOrders';
import { DepotOrderDto } from '../types/OrderTypes';
import OrderTable from '../../billingmanager/components/OrderTable';
import OrderDetails from '../../billingmanager/components/OrderDetails';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import BackButton from '../components/BackButton';
import Pagination from '../components/Pagination';

function PreparedOrdersPage() {
  const {
    orders,
    loading,
    error,
    refetch
  } = usePreparedOrders();

  const [selectedOrder, setSelectedOrder] = useState<DepotOrderDto | null>(null);
  const [activeTab, setActiveTab] = useState<'prepared' | 'invoiced'>('prepared');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Convertir DepotOrderDto a OrderTableData para compatibilidad
  const convertToTableData = (order: any) => ({
    id: order.depotOrderId,
    status: Number(order.status) === 7 ? 'Preparado' : 'Facturado', // Estado según el número
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

  // Filtrar órdenes por estado según la pestaña activa
  const getFilteredOrders = () => {
    if (activeTab === 'prepared') {
      // Estado 7: Preparado
      return orders.filter((order: any) => Number(order.status) === 7);
    } else {
      // Estado 8: Facturado
      return orders.filter((order: any) => Number(order.status) === 8);
    }
  };

  const emptyMessageTitle =
    activeTab === "prepared"
      ? "No hay órdenes preparadas"
      : "No hay órdenes facturadas";

  const emptyMessageBody =
    activeTab === "prepared"
      ? "Aún no se ha terminado de preparar ninguna orden."
      : "Aún no se ha facturado ninguna orden.";


  const filteredOrders = getFilteredOrders();
  
  // Paginación
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, itemsPerPage]);
  
  const tableData = paginatedOrders.map(convertToTableData);
  
  // Resetear página cuando cambia la pestaña
  const handleTabChange = (tab: 'prepared' | 'invoiced') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleView = (id: number) => {
    const order = filteredOrders.find((o: any) => (o as any).depotOrderId === id);
    setSelectedOrder(order || null);
  };


  if (loading) {
    return <LoadingSpinner message="Cargando órdenes armadas..." />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full py-20 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Órdenes Armadas</h1>
              <p className="mt-2 text-gray-600">
                Visualiza las órdenes que han sido preparadas y facturadas
              </p>
            </div>
            <BackButton to="/depot" />
          </div>
        </div>

        {/* Pestañas */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('prepared')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'prepared'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preparadas ({orders.filter((order: any) => Number(order.status) === 7).length})
              </button>
              <button
                onClick={() => handleTabChange('invoiced')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'invoiced'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Facturadas ({orders.filter((order: any) => Number(order.status) === 8).length})
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <OrderTable
            orders={tableData}
            loading={loading}
            onRefetch={refetch}
            onView={handleView}
            error={error}
            activeTab={activeTab}
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
                    Detalles de la Orden {activeTab === 'prepared' ? 'Preparada' : 'Facturada'}
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
                    status: activeTab === 'prepared' ? 'Preparada' : 'Facturada'
                  }} 
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PreparedOrdersPage;
