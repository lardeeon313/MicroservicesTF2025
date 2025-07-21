import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { DepotOrderMissingDto } from '../types/OrderTypes';
import LoadingSpinner from '../../../../components/LoadingSpinner';

function MissingOrdersPage() {
  const {
    missingOrders,
    loading,
    error
  } = useOrders();

  const [selectedMissingOrder, setSelectedMissingOrder] = useState<DepotOrderMissingDto | null>(null);

  const handleView = (missingOrder: DepotOrderMissingDto) => {
    setSelectedMissingOrder(missingOrder);
  };

  const handleReportToSales = (missingOrder: DepotOrderMissingDto) => {
    // Implementar lógica para reportar faltante a ventas
    console.log('Reportar faltante a ventas:', missingOrder);
    // Aquí se podría abrir un formulario o enviar una notificación
    alert('Faltante reportado a ventas exitosamente');
  };

  if (loading) {
    return <LoadingSpinner message="Cargando órdenes con faltantes..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Órdenes con Faltantes</h1>
          <p className="mt-2 text-gray-600">
            Gestiona las órdenes que tienen productos faltantes
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {missingOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay órdenes con faltantes</h3>
            <p className="text-gray-600">Todas las órdenes están completas.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {missingOrders.map((missingOrder) => (
              <div
                key={missingOrder.MissingId}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Orden #{missingOrder.DepotOrderId}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Faltante #{missingOrder.MissingId}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Faltante
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Cliente:</span> {missingOrder.DepotOrder.CustomerName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Fecha:</span> {new Date(missingOrder.MissingDate).toLocaleDateString('es-AR')}
                  </p>
                  {missingOrder.MissingReason && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Motivo:</span> {missingOrder.MissingReason}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Productos faltantes:</h4>
                  <div className="space-y-1">
                    {missingOrder.MissingItems.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <div className="font-medium">{item.ProductName}</div>
                        <div className="text-xs text-gray-500">
                          {item.ProductBrand} - Cantidad faltante: {item.MissingQuantity}
                        </div>
                      </div>
                    ))}
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
        )}

        {/* Diálogo de detalles de orden faltante */}
        {selectedMissingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Detalles del Faltante</h2>
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
                        <span className="font-medium">Orden ID:</span> {selectedMissingOrder.DepotOrderId}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cliente:</span> {selectedMissingOrder.DepotOrder.CustomerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {selectedMissingOrder.DepotOrder.CustomerEmail}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Teléfono:</span> {selectedMissingOrder.DepotOrder.PhoneNumber}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Información del Faltante</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Faltante ID:</span> {selectedMissingOrder.MissingId}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Fecha:</span> {new Date(selectedMissingOrder.MissingDate).toLocaleDateString('es-AR')}
                      </p>
                      {selectedMissingOrder.MissingReason && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Motivo:</span> {selectedMissingOrder.MissingReason}
                        </p>
                      )}
                      {selectedMissingOrder.MissingDescription && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Descripción:</span> {selectedMissingOrder.MissingDescription}
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
                        {selectedMissingOrder.MissingItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.ProductName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.ProductBrand}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.MissingQuantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.Packaging || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedMissingOrder.DescriptionResolution && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Resolución</h3>
                    <p className="text-sm text-gray-600 bg-green-50 p-3 rounded">
                      {selectedMissingOrder.DescriptionResolution}
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
      </div>
    </div>
  );
}

export default MissingOrdersPage;
