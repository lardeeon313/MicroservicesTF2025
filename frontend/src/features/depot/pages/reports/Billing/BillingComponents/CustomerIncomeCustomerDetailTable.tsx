// CustomerIncomeCustomerDetailTable.tsx
import React, { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import API from "../../../../../../api/axios";
import { Pagination } from "../../../../../../components/Pagination";

const ITEMS_PER_PAGE = 10;

type CustomerIncomeDetailItem = {
  orderNumber: string;
  orderDate: string;
  billingDate: string;
  totalAmount: number;
  customerName: string;
  itemsCount?: number;
};

type Props = {
  data: CustomerIncomeDetailItem[];
};

const CustomerIncomeCustomerDetailTable: React.FC<Props> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter(
    (item) => item.totalAmount > 0 && item.orderDate !== "N/A"
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, safePage]);

  const totalIncome = filteredData.reduce((sum, item) => sum + item.totalAmount, 0);
  const customerName = filteredData[0]?.customerName;

  // Handler del botón Exportar PDF
  const handleExportPdf = async () => {
    try {
      const response = await API.get(
        "/depot/depotreports/invoiced-orders/by-customer/pdf",
        {
          params: { customerName },
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Pedidos_Facturados_${customerName}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Error al generar el PDF.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8 bg-white border-b border-gray-200 rounded-xl shadow-sm">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="space-y-1" >
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Detalle de Pedidos del cliente: {customerName}
              </h2>
              <p className="text-green-600 font-medium text-lg">
                Imprime la cantidad de pedidos facturados del cliente:
                <span className="font-semibold text-gray-700"> {customerName}</span>
              </p>
            </div>
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-green-500/40"
            >
              <FileDown size={22} />
              Descargar PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Nro Pedido
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Fecha de Emisión
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={index} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{item.orderNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{item.orderDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-emerald-700 font-bold">
                      ${item.totalAmount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No hay pedidos facturados para este cliente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Mostrando {paginatedData.length} de {filteredData.length} pedido{filteredData.length !== 1 ? "s" : ""}
            </p>
            <p className="text-lg font-bold text-emerald-700">
              Total: ${totalIncome.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          {/* 👇 Paginación fuera de la card */}
        {totalPages > 1 && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerIncomeCustomerDetailTable;
