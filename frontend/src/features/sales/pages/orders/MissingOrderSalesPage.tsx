import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../../components/LoadingSpinner';

import { Eye, Pencil, Ban } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMissingOrders } from '../../hooks/useMissingOrders';
import { OrderMissingDto, OrderStatus } from '../../types/OrderTypes';
import { Pagination } from '../../../../components/Pagination';
import ModifyOrderModal from '../../components/Orders/ModifyOrderModal';
import ReissueOrderModal from '../../components/Orders/ReissueOrderModal';
import OrderDetailsModal from '../../components/Orders/OrderDetailsModal';
import BackButton from '../../../../components/BackButton';

function MissingOrdersSalesPage() {
  const navigate = useNavigate();
  const {
    orders,
    loading,
    error,
    statusFilter,
    handleUpdate,
    handleReissue,
    handleCancel,
    handleSearch,
  } = useMissingOrders();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchId, setSearchId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const itemsPerPage = 6;

  const [selectedOrder, setSelectedOrder] = useState<OrderMissingDto | null>(null);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showReissueModal, setShowReissueModal] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const id = parseInt(searchId.trim());
    if (isNaN(id)) {
      toast.error('El ID debe ser un número válido');
      return;
    }

    setSearchLoading(true);
    const foundOrder = await handleSearch(id);
    if (foundOrder) {
      setSelectedOrder(foundOrder);
    }
    setSearchLoading(false);
  };

  const handleOpenModifyModal = (order: OrderMissingDto) => {
    setSelectedOrder(order);
    setShowModifyModal(true);
  };

  const handleOpenReissueModal = (order: OrderMissingDto) => {
    setSelectedOrder(order);
    setShowReissueModal(true);
  };

  const handleCloseModals = () => {
    setSelectedOrder(null);
    setShowModifyModal(false);
    setShowReissueModal(false);
  };

  const handleCancelOrder = async (orderId: number) => {
    // Aquí puedes agregar un modal de confirmación si lo deseas
    if (toast.custom('¿Estás seguro de que quieres cancelar esta orden?')) {
      try {
        await handleCancel(orderId, 'Cancelado desde ventas');
      } catch (e) {
        // El error ya es manejado por el hook
      }
    }
  };

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <LoadingSpinner message="Cargando órdenes con faltantes..." height="h-screen" />;
  }

  const tabTitle =
    statusFilter === 'PendingResolution'
      ? 'Pendientes de Solución'
      : 'Pendientes de Reemisión';

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/home"></BackButton>
        <h1 className="text-center text-4xl font-bold text-red-600">Órdenes con Faltantes</h1>
        <p className="text-center text-lg text-gray-700 mb-12">
                Gestiona las órdenes que fueron reportadas desde el depósito.
        </p>
        <div className="container mx-auto sm:p-6 lg:p-8 mt-5">
          <div className="mb-6">
            <form onSubmit={handleSearchSubmit} className="flex space-x-2">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Buscar por ID de faltante..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={searchLoading}
                />
              <button
                type="submit"
                disabled={searchLoading || !searchId.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                {searchLoading ? 'Buscando...' : 'Buscar'}
              </button>
            </form>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => navigate('/sales/missing-orders?status=pendingResolution')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    statusFilter === 'PendingResolution'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  >
                  Pendientes de Solución
                </button>
                <button
                  onClick={() => navigate('/sales/missing-orders?status=pendingReissued')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    statusFilter === 'PendingReissued'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  >
                  Pendientes de Reemisión
                </button>
              </nav>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <h3 className="text-xl font-medium mb-2">
                No hay órdenes en estado "{tabTitle}"
              </h3>
              <p>Todas las órdenes de este tipo han sido gestionadas.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedOrders.map((order) => (
                  <div
                  key={order.missingId}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Orden de Venta #{order.salesOrderId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Reporte de Faltante #{order.missingId}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                        {order.salesOrder.status === OrderStatus.PendingResolution ? 'A resolver' : 'Preparada para reemisión'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Fecha Reporte:</span> {new Date(order.missingDate).toLocaleDateString('es-AR')}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Motivo:</span> {order.missingReason}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cliente:</span>{' '}
                        {order.salesOrder.customerFirstName} {order.salesOrder.customerLastName}
                      </p>
                    </div>

                    <div className="flex justify-between items-center space-x-2 mt-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                        >
                        <Eye size={16} /> Ver Detalles
                      </button>
                      {statusFilter === 'pendingResolution' && (
                        <button
                        onClick={() => handleOpenModifyModal(order)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Pencil size={16} /> Modificar
                        </button>
                      )}
                      {statusFilter === 'pendingReissued' && (
                        <button
                        onClick={() => handleOpenReissueModal(order)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Pencil size={16} /> Reemitir
                        </button>
                      )}
                      {statusFilter === 'pendingResolution' && (
                        <button
                        onClick={() => handleCancelOrder(order.salesOrderId)}
                        className="px-2 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          <Ban size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {orders.length > itemsPerPage && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(orders.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                    />
                </div>
              )}
            </>
          )}

          {selectedOrder && (
            <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onModify={() => handleOpenModifyModal(selectedOrder)}
            onReissue={() => handleOpenReissueModal(selectedOrder)}
            onCancel={() => handleCancelOrder(selectedOrder.salesOrderId)}
            statusFilter={statusFilter}
            />
          )}

          {showModifyModal && selectedOrder && (
            <ModifyOrderModal
            order={selectedOrder}
            onClose={handleCloseModals}
            onSave={handleUpdate}
            />
          )}

          {showReissueModal && selectedOrder && (
            <ReissueOrderModal
            order={selectedOrder}
            onClose={handleCloseModals}
            onReissue={handleReissue}
            />
          )}
          </div>
        </div>
    </div>
  );
}

export default MissingOrdersSalesPage;