import React from "react";
import { Users, Package2 } from "lucide-react";

type Props = {
  data: {
    depotTeamId: number;
    teamName: string;
    ordersHandled: number;
  }[];
};

const TeamProductivityTable: React.FC<Props> = ({ data }) => {
  return (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-50/30 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Productividad por Equipo</h3>
            <p className="text-sm text-gray-500">Resumen de rendimiento por equipos de trabajo</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID Equipo
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre Equipo
              </th>
              <th className="px-8 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pedidos Completados
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.length > 0 ? (
              data.map((item) => (
                <tr 
                  key={item.depotTeamId} 
                  className="border-b border-gray-50 hover:bg-gray-50/30 transition-all duration-200"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                        <span className="text-sm font-semibold text-blue-600">
                          {item.depotTeamId}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">Equipo #{item.depotTeamId}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-4">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{item.teamName}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end">
                      <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                        <Package2 className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.ordersHandled.toLocaleString()}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-8 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-gray-50 rounded-2xl mb-6">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">No hay datos disponibles</p>
                    <p className="text-sm text-gray-500">No se encontraron datos para el rango seleccionado</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamProductivityTable;


