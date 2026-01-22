import React from "react";
import { AdminCustomerReportRow } from "../Types/CustomerPaymentType";
import { AlertCircle } from "lucide-react";

interface Props {
  data: AdminCustomerReportRow[];
  loading: boolean;
}

const AdminCustomerPaymentReportTable: React.FC<Props> = ({ data, loading }) => {
  if (loading) return <p className="text-gray-600">Cargando...</p>;

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin resultados
          </h3>
          <p className="text-gray-600">
            No se obtuvieron clientes según los filtros consultados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b">
          <tr>
            <th className="px-4 py-3 text-left">N°Cliente</th>
            <th className="px-4 py-3 text-left">Cliente</th>
            <th className="px-4 py-3 text-left">Tipos de pago</th>
            <th className="px-4 py-3 text-left">Dirección</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr
              key={row.customerId}
              className="hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {row.nroCustomer}
              </td>

              <td className="px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {row.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{row.fullName}</p>
                  <p className="text-xs text-gray-500">Cliente</p>
                </div>
              </td>

              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {row.paymentTypes.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded-full border border-blue-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-4 py-3 text-gray-700">
                {row.address || (
                  <span className="text-gray-400">Sin dirección</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomerPaymentReportTable;
