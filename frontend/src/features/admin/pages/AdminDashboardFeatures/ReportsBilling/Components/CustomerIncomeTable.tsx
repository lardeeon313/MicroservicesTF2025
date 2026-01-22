// CustomerIncomeTable.tsx
import React from "react";
import { FileDown } from "lucide-react";
import API from "../../../../../../api/axios";

type CustomerIncomeBillingItem = {
  customerName: string;
  customerEmail: string;
  billingDate: string;
  totalAmount: number;
};

type Props = {
  data: CustomerIncomeBillingItem[];
};

const CustomerIncomeTable: React.FC<Props> = ({ data }) => {
  const groupByCustomer = (data: CustomerIncomeBillingItem[]) => {
    const grouped = data.reduce((acc, item) => {
      const key = `${item.customerName}-${item.customerEmail}`;
      if (!acc[key]) {
        acc[key] = {
          customerName: item.customerName,
          customerEmail: item.customerEmail,
          totalOrders: 0,
          totalIncome: 0,
        };
      }
      acc[key].totalOrders += 1;
      acc[key].totalIncome += item.totalAmount;
      return acc;
    }, {} as Record<string, { customerName: string; customerEmail: string; totalOrders: number; totalIncome: number }>);
    return Object.values(grouped);
  };

  const groupedData = groupByCustomer(data);
  const totalIncome = groupedData.reduce((sum, item) => sum + item.totalIncome, 0);

  const downloadReport = async () => {
    try {
      const response = await API.get("depot/depotreports/invoiced-orders/pdf", {
        responseType: "blob",
      });
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
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-xl p-6 border border-emerald-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Ingresos por Cliente</h3>
            <p className="text-gray-600 text-sm mt-1">Imprime en pdf todos los ingresos generados</p>
          </div>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FileDown size={18} />
            Descargar PDF
          </button>
        </div>
      </div>
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
                  Total de Pedidos
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Total de Ingresos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {groupedData.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    {item.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {item.customerEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {item.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-emerald-700 font-bold">
                    ${item.totalIncome.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {groupedData.length} cliente{groupedData.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-gray-600">
            Total:{" "}
            <span className="font-bold text-emerald-700 text-lg">
              ${totalIncome.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerIncomeTable;
