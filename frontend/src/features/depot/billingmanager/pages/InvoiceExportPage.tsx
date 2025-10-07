// pages/InvoicedOrdersPage.tsx
import { useEffect, useState } from "react";
import { getAllInvoicedOrders } from "../services/OrderService";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";
import { ChartColumn, DollarSign, File } from "lucide-react";
import StatCard from "../components/StatCard";
import formatDate from "../../../../utils/formateDate";
import { BillingAddressDto } from "../types/OrderTypes";

type InvoicedOrder = {
  billingOrderId: number;
  customerName: string;
  totalAmount: number;
  date: string;
  address: BillingAddressDto,
};

const InvoicedOrdersPage = () => {
  const [orders, setOrders] = useState<InvoicedOrder[]>([]);
  const [loading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  getAllInvoicedOrders()
    .then((data) => {
      console.log("Datos API crudos:", data);

      // Mapeo para usar los campos correctos
      const mappedOrders = data.map((item) => ({
        billingOrderId: item.depotOrderId,  // Ajuste de nombre
        customerName: item.customerName,
        date: item.orderDate,
        totalAmount: item.totalAmount,
        address: item.address,
      }));

      setOrders(mappedOrders);
    })
    .catch((err) => console.error("Error cargando pedidos:", err));
    }, []);


  if (loading) {
    <LoadingSpinner message='Cargando órdenes...' height='400' />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Facturas Emitidas</h1>
          <p className="text-center text-lg text-gray-700 mb-12">Gestiona y consulta todas las facturas generadas</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Facturas" value={orders.length} icon={File} color="blue" />
            <StatCard 
              title="Monto Total" 
              value={`$${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}`} 
              icon={DollarSign} 
              color="green" 
            />
            <StatCard 
              title="Promedio por Factura" 
              value={`$${orders.length > 0 ? (orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length).toFixed(0) : 0}`} 
              icon={ChartColumn} 
              color="purple" 
            />
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                Lista de Facturas
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">
                  No hay facturas emitidas
                </h3>
                <p className="text-slate-500 text-center max-w-md">
                  Cuando se generen facturas, aparecerán aquí para que puedas gestionarlas fácilmente.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full ">
                  <thead className="bg-slate-50 ">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        ID Factura
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Dirección
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                      
                    {orders.map((order, index) => (
                      <tr 
                        key={order.billingOrderId || index} 
                        className={`hover:bg-slate-50 transition-colors duration-150 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-red-800">
                              #{order.billingOrderId}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm  font-semibold">
                                {order.customerName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {order.customerName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {order.address
                              ? `${order.address.street} ${order.address.number},${order.address.apartment}, ${order.address.city}, ${order.address.province},${order.address.country}`
                              : 'Sin dirección'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{formatDate(order.date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-red-600">
                            ${order.totalAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => {
                              console.log("➡️ Navegando a:", `/depot/billingmanager/exports/${order.billingOrderId}`);
                              navigate(`/depot/billingmanager/exports/${order.billingOrderId}`);
                              }}
                            className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-400 to-red-700 text-white text-sm font-medium rounded-lg hover:from-red-500 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-sm hover:shadow-md"
                          >
                            Imprimir factura del Pedido
                            <svg 
                              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicedOrdersPage;

