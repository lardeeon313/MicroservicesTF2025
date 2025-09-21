// pages/InvoiceDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoicedOrderById } from "../services/OrderService";
import { useInvoiceExport } from "../hooks/useInvoiceExport";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import EmptyState from "../../../../components/EmptyState";
import { AlertCircle, Calendar, Mail, Phone, User } from "lucide-react";
import BackButton from "../../../../components/BackButton";
import InfoItem from "../../../../components/InfoItem";
import TotalCard from "../components/TotalCard";

type InvoiceItem = {
  productName: string;
  productBrand: string;
  quantity: number;
  unitPrice: number;
};

type Invoice = {
  billingOrderId: number;
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  orderDate: string;
  totalAmount: number;
  items: InvoiceItem[];
};

const InvoiceOneDetailPage = () => {
  const { billingOrderId } = useParams<{ billingOrderId: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const { handleExport, loading: exporting } = useInvoiceExport();

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!billingOrderId) return;

      setLoading(true);
      try {
        const data = await getInvoicedOrderById(Number(billingOrderId));
        
        // Mapeo de campos según tu backend
        const mappedInvoice: Invoice = {
          billingOrderId: data.billingOrderId ?? data.depotOrderId ?? 0,
          customerName: data.customerName ?? "",
          customerEmail: data.customerEmail ?? "",
          phoneNumber: data.phoneNumber ?? "",
          orderDate: data.orderDate ?? "",
          totalAmount: data.totalAmount ?? 0,
          items: data.items ?? [],
        };

        setInvoice(mappedInvoice);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [billingOrderId]);

  if (loading) {
    <LoadingSpinner message="Cargando factura..." height="400" />;
  }

  if (!invoice) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Error al cargar la orden"
        description="Intenta recargar la página o volver más tarde."
      />
    );
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager/exports" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
          <div className="bg-white rounded-lg shadow-md mb-6 mt-6 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-700 px-6 py-4">
              <h1 className="text-3xl font-bold text-white">
                Factura #{invoice.billingOrderId}
              </h1>
            </div>
            
            {/* Customer Information */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Información del Cliente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={<User className="text-red-600 w-5 h-5" />}
                  label="Cliente"
                  value={invoice.customerName}
                  bgColor="bg-red-50"
                  textColor="text-red-600"
                />
                <InfoItem
                  icon={<Mail className="text-red-600 w-5 h-5" />}
                  label="Email"
                  value={invoice.customerEmail}
                  bgColor="bg-red-100"
                  textColor="text-red-600"
                />
                <InfoItem
                  icon={<Phone className="text-red-600 w-5 h-5" />}
                  label="Teléfono"
                  value={invoice.phoneNumber}
                  bgColor="bg-red-100/50"
                  textColor="text-red-600"
                />
                <InfoItem
                  icon={<Calendar className="text-red-600 w-5 h-5" />}
                  label="Fecha de Pedido"
                  value={new Date(invoice.orderDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  bgColor="bg-red-100/40"
                  textColor="text-red-600"
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Detalle de Productos
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Unit.
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {item.productBrand}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <TotalCard label="TOTAL:" amount={invoice.totalAmount} size="large" />


          {/* Export Buttons */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Exportar Factura
              </h3>
              <div className="flex flex-wrap gap-4">
                <button
                  disabled={exporting}
                  onClick={() => handleExport(invoice.billingOrderId, 0)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {exporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Exportando...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📄</span>
                      Exportar PDF
                    </>
                  )}
                </button>
                
                <button
                  disabled={exporting}
                  onClick={() => handleExport(invoice.billingOrderId, 1)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {exporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Exportando...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📊</span>
                      Exportar XLSX
                    </>
                  )}
                </button>
                
                <button
                  disabled={exporting}
                  onClick={() => handleExport(invoice.billingOrderId, 2)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {exporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Exportando...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📝</span>
                      Exportar DOCX
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceOneDetailPage;