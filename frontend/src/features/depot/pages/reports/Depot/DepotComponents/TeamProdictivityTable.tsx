import React from "react";

type Props = {
  data: {
    depotTeamId: number;
    teamName: string;
    ordersHandled: number;
  }[];
};

const TeamProductivityTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Productividad por Equipo</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-red-500 text-white backdrop-opacity-90">
              <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wide">
                ID Equipo
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wide">
                Nombre Equipo
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium uppercase tracking-wide">
                Pedidos Completados
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr 
                  key={item.depotTeamId} 
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-800 font-semibold text-sm">
                      {item.depotTeamId}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.teamName}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-semibold text-gray-900">
                      {item.ordersHandled.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  <div>
                    <p className="text-lg font-medium mb-1">No hay datos disponibles</p>
                    <p className="text-sm">No se encontraron datos para el rango seleccionado</p>
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


