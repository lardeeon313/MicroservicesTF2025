import React from "react";
import API from "../../../../../../api/axios";
import { FileDown } from "lucide-react";

export type CustomerIncomeBillingItem = {
  customerName: string;
  customerEmail: string;
  billingDate: string;
  totalAmount: number;
};

export type CustomerIncomeBillingType = {
  data: CustomerIncomeBillingItem[];
};

const CustomerIncomeTable: React.FC<CustomerIncomeBillingType> = ({ data }) => {
  // Calcular estadísticas
  const totalIncome = data.reduce((sum, item) => sum + item.totalAmount, 0);
  const uniqueCustomers = new Set(data.map(item => item.customerName)).size;
  const averageIncome = data.length > 0 ? totalIncome / data.length : 0;

  // 🟢 FORMATO DE FECHA
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const downloadReport = async () => {
    try {
      const response = await API.get(
        "depot/depotreports/invoiced-orders/pdf",
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "Reporte_Ordenes_Facturadas.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error descargando el PDF:", err);
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-xl p-6 border border-emerald-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Ingresos de Clientes
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Resumen de facturación por cliente
            </p>
          </div>

          {/* Botón descargar PDF */}
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FileDown size={18} />
            Descargar PDF
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total ingresos */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-emerald-100">
            <p className="text-sm text-gray-600">Total Ingresos</p>
            <p className="text-xl font-bold text-emerald-700">
              ${totalIncome.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Clientes únicos */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-emerald-100">
            <p className="text-sm text-gray-600">Clientes únicos</p>
            <p className="text-xl font-bold text-teal-700">{uniqueCustomers}</p>
          </div>

          {/* Promedio */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-emerald-100">
            <p className="text-sm text-gray-600">Promedio por factura</p>
            <p className="text-xl font-bold text-cyan-700">
              $
              {averageIncome.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Fecha Factura
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Total Factura
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Cliente */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.customerName}
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {item.customerEmail}
                  </td>

                  {/* Fecha bien formateada */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(item.billingDate)}
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 whitespace-nowrap text-emerald-700 font-bold">
                    $
                    {item.totalAmount.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-medium">{data.length}</span>{" "}
            factura{data.length !== 1 ? "s" : ""}
          </p>

          <p className="text-sm text-gray-600">
            Total:{" "}
            <span className="font-bold text-emerald-700 text-lg">
              $
              {totalIncome.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerIncomeTable;
