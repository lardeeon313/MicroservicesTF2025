// DeliveryReportGeneralTable.tsx
import React from "react";
import { GeneralGridRow } from "../../VerificationHocks/useDeliveryTimesReport";
import { Package,CheckCircle2,AlertCircle } from "lucide-react";

interface Props {
  data: GeneralGridRow[];
}

export const DeliveryReportGeneralTable: React.FC<Props> = ({ data }) => {
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  };

  const totals = data.reduce(
    (acc, row) => ({
      total: acc.total + row.total,
      onTime: acc.onTime + row.onTime,
      late: acc.late + row.late,
    }),
    { total: 0, onTime: 0, late: 0 }
  );

  return (
    <div className="w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Resumen General de Entregas</h2>
            <p className="text-blue-100 text-sm mt-1">Rendimiento por equipo y zona</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Equipo</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Zona</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-green-700 uppercase tracking-wider">A Tiempo</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-red-700 uppercase tracking-wider">Fuera de Tiempo</th>
              
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, i) => {
              const efficiency = calculatePercentage(row.onTime, row.total);
              const efficiencyNum = parseFloat(efficiency);
              
              return (
                <tr key={i} className="hover:bg-blue-50 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{row.teamName ?? "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
                      {row.zoneName ?? "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-gray-900 text-lg">{row.total}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold text-green-600 text-lg">{row.onTime}</span>
                      
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold text-red-600 text-lg">{row.late}</span>
                      
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};