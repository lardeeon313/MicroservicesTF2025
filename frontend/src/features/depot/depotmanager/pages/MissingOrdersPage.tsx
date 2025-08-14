import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { DepotOrderMissingDto, OrderStatus } from '../types/OrderTypes';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import BackButton from '../components/BackButton';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';
import { getMissingOrderById, reportMissingOrder } from '../services/orderService';

function MissingOrdersPage() {
  const {
    missingOrders,
    loading,
    error
  } = useOrders();



  const [selectedMissingOrder, setSelectedMissingOrder] = useState<DepotOrderMissingDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'pending' | 'reported'>('pending');
  const [showReportModal, setShowReportModal] = useState(false);
  const [orderToReport, setOrderToReport] = useState<DepotOrderMissingDto | null>(null);
  const [searchId, setSearchId] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState(false);
  const itemsPerPage = 6; // 6 cards por página (2x3 grid)
  const pendingMissingOrders = missingOrders.filter(m => m.depotOrder.status === OrderStatus.MissingProduct);
  const reportedMissingOrders = missingOrders.filter(m => m.depotOrder.status === OrderStatus.PendingResolution);
  const orderToShow = activeTab === 'pending' ? pendingMissingOrders : reportedMissingOrders;
  console.log(orderToShow)
  const handleView = (missingOrder: DepotOrderMissingDto) => {
    setSelectedMissingOrder(missingOrder);
  };

  const handleReportToSales = (missingOrder: DepotOrderMissingDto) => {
    setOrderToReport(missingOrder);
    setShowReportModal(true);
  };

  const confirmReportToSales = async () => {
    if (!orderToReport) return;
    
    try {
      await reportMissingOrder({
        depotOrderId: orderToReport.depotOrderId,
        missingItems: orderToReport.missingItems.map(item => ({
          orderItemId: item.depotOrderItemId,
          productName: item.productName,
          productBrand: item.productBrand,
          packaging: item.packaging,
          quantity: item.missingQuantity
        })),
        missingReason: orderToReport.missingReason,
        missingDescription: orderToReport.missingDescription
      });
      toast.success('Faltante reportado a ventas exitosamente');
      setShowReportModal(false);
      setOrderToReport(null);
      // Recargar datos si es necesario
    } catch (error) {
      console.error('Error reportando faltante:', error);
      toast.error('Error al reportar faltante a ventas');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const id = parseInt(searchId.trim());
    if (isNaN(id)) {
      toast.error('El ID debe ser un número válido');
      return;
    }

    try {
      setSearchLoading(true);
      const order = await getMissingOrderById(id);
      setSelectedMissingOrder(order);
      toast.success('Faltante encontrado');
    } catch (error) {
      console.error('Error buscando faltante:', error);
      toast.error('No se encontró el faltante con ese ID');
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando órdenes con faltantes..." />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full py-20 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Órdenes con Faltantes</h1>
              <p className="mt-2 text-gray-600">
                Gestiona las órdenes que tienen productos faltantes
              </p>
            </div>
            <BackButton to="/depot" />
          </div>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Buscar por ID de faltante..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={searchLoading}
            />
            <button
              type="submit"
              disabled={searchLoading || !searchId.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>

        {/* Pestañas */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pendientes de Reportar
              </button>
              <button
                onClick={() => setActiveTab('reported')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reported'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reportadas
              </button>
            </nav>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}



        {orderToShow.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay órdenes con faltantes</h3>
            <p className="text-gray-600">Todas las órdenes están completas.</p>
          </div>
        ) : (
          <>
            {/* Paginación de cards */}
            {(() => {
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              const paginatedMissingOrders = orderToShow.slice(startIndex, endIndex);
              

              
              return (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {paginatedMissingOrders.filter(missingOrder => missingOrder).map((missingOrder) => (
                                                                      <div
                          key={missingOrder.missingId}
                          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Orden #{missingOrder.depotOrderId}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Faltante #{missingOrder.missingId}
                              </p>
                            </div>
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Faltante
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Orden ID:</span> D-{missingOrder.depotOrderId}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Venta ID:</span> V-{missingOrder.salesOrderId}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Fecha:</span> {new Date(missingOrder.missingDate).toLocaleDateString('es-AR')}
                          </p>
                          {missingOrder.missingReason && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Motivo:</span> {missingOrder.missingReason}
                            </p>
                          )}
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Productos faltantes:</h4>
                          <div className="space-y-1">
                            {missingOrder.missingItems && missingOrder.missingItems.length > 0 ? (
                              missingOrder.missingItems.map((item, index) => (
                                <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                  <div className="font-medium">{item.productName || 'N/A'}</div>
                                  <div className="text-xs text-gray-500">
                                    {item.productBrand || 'N/A'} - Cantidad faltante: {item.missingQuantity || 0}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">
                                No hay productos faltantes registrados
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleView(missingOrder)}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Paginación */}
                  {orderToShow.length > itemsPerPage && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(orderToShow.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        totalItems={orderToShow.length}
                        itemsPerPage={itemsPerPage}
                      />
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}

        {/* Diálogo de detalles de orden faltante */}
        {selectedMissingOrder && selectedMissingOrder.missingId && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Detalles del Faltante D-{selectedMissingOrder.depotOrderId}</h2>
                <button
                  onClick={() => setSelectedMissingOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Información de la Orden</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Orden ID:</span> D-{selectedMissingOrder.depotOrderId}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Venta ID:</span> V-{selectedMissingOrder.salesOrderId}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Información del Faltante</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Faltante ID:</span> {selectedMissingOrder.missingId}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Fecha del Faltante:</span> {new Date(selectedMissingOrder.missingDate).toLocaleDateString('es-AR')}
                      </p>
                      {selectedMissingOrder.missingReason && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Motivo:</span> {selectedMissingOrder.missingReason}
                        </p>
                      )}
                      {selectedMissingOrder.missingDescription && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Descripción:</span> {selectedMissingOrder.missingDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Productos Faltantes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Marca
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad Faltante
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Empaque
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedMissingOrder.missingItems?.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.productName || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.productBrand || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.missingQuantity || 0}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.packaging || 'N/A'}</td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={4} className="px-4 py-3 text-sm text-gray-500 text-center">
                              No hay productos faltantes registrados
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedMissingOrder.descriptionResolution && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Resolución</h3>
                    <p className="text-sm text-gray-600 bg-green-50 p-3 rounded">
                      {selectedMissingOrder.descriptionResolution}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => handleReportToSales(selectedMissingOrder)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Reportar Faltante a Ventas
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación para reportar a ventas */}
        {showReportModal && orderToReport && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Confirmar Reporte</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  ¿Estás seguro de que quieres reportar el faltante D-{orderToReport.depotOrderId} a ventas?
                </p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Faltante ID:</span> {orderToReport.missingId}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Motivo:</span> {orderToReport.missingReason || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmReportToSales}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Confirmar Reporte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MissingOrdersPage;
