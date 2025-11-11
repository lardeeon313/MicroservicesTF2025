import React from "react";
import { ProcessingTimeOrder } from "../../../../billingmanager/types/BillingTimeProcessType";

type Props = {
  data: ProcessingTimeOrder[];
};

const BillingTimeProcessTable: React.FC<Props> = ({ data }) => {
  const getTimeCategory = (minutes: number) => {
    if (minutes <= 15) return { color: "text-emerald-600", bg: "bg-emerald-100", icon: "⚡" };
    if (minutes <= 30) return { color: "text-yellow-600", bg: "bg-yellow-100", icon: "⏱️" };
    if (minutes <= 60) return { color: "text-orange-600", bg: "bg-orange-100", icon: "⏳" };
    return { color: "text-red-600", bg: "bg-red-100", icon: "🚨" };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-200">
            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                    clipRule="evenodd"
                  />
                </svg>
                Pedido
              </div>
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Tiempo (min)
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, index) => {
            const timeCategory = getTimeCategory(row.averageProcessingTime);
            return (
              <tr
                key={row.orderId}
                className={`hover:bg-violet-50 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                      #
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Pedido #{row.orderId}</div>
                      <div className="text-xs text-gray-500">ID: {row.orderId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{timeCategory.icon}</span>
                    <div>
                      <div className={`text-sm font-bold ${timeCategory.color}`}>
                        {row.averageProcessingTime} minutos
                      </div>
                      <div
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${timeCategory.bg} ${timeCategory.color}`}
                      >
                        {row.averageProcessingTime <= 15
                          ? "Rápido"
                          : row.averageProcessingTime <= 30
                          ? "Normal"
                          : row.averageProcessingTime <= 60
                          ? "Lento"
                          : "Muy Lento"}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-medium">{data.length}</span> pedido{data.length !== 1 ? "s" : ""} procesado
          {data.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default BillingTimeProcessTable;
