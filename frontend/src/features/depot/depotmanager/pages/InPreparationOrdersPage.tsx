import { useState, useMemo } from 'react';
import { useInPreparationOrders } from '../hooks/useOrders';
import { DepotOrderDto } from '../types/OrderTypes';
import OrderTable from '../../billingmanager/components/OrderTable';
import OrderDetails from '../../billingmanager/components/OrderDetails';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import BackButton from '../components/BackButton';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // Convertir DepotOrderDto a OrderTableData para compatibilidad
  const convertToTableData = (order: DepotOrderDto) => ({
    id: order.depotOrderId,
    status: 'En Preparación', // Estado fijo para órdenes en preparación
    orderDate: order.orderDate ? order.orderDate.toString() : 'Sin fecha',
    deliveryDate: order.deliveryDate ? order.deliveryDate.toString() : undefined,
    deliveryDetail: order.deliveryDetail ?? '',
    customerFirstName: order.customerName?.split(' ')[0] || '' ,
    customerLastName: order.customerName?.split(' ').slice(1).join(' ') || '',
    operatorName: order.operatorName || '-',
    items: Array.isArray(order.items) ? order.items.map((item: any) => ({
      productName: item.productName ?? '',
      productBrand: item.productBrand ?? '',
      quantity: item.quantity ?? 0
    })) : []
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

  //const handleActionChange = (action: string, id: number) => {
    // Sin acciones específicas para pedidos en preparación
    //console.log('Acción no implementada:', action, id);
  //};

  if (loading) {
    return <LoadingSpinner message="Cargando órdenes en preparación..." height='h-screen' />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full py-20 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Órdenes en Preparación</h1>
              <p className="mt-2 text-gray-600">
                Visualiza las órdenes que están siendo preparadas por operarios asignados.
              </p>
            </div>
            <BackButton to="/depot" />
          </div>
        </div>

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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Detalles de la Orden en Preparación</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <OrderDetails order={{...convertToTableData(selectedOrder), status: 'En Preparación'}} />
              </div>
            </div>
          </>
        )}
        <button
        onClick={() => navigate('/depot/pending-orders')}
        className="mt-4 ml-2 px-4 py-2 inline-block border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        
      >
        Ir a Órdenes Pendientes
      </button>
      </div>
    </div>
  );
}

export default InPreparationOrdersPage; 