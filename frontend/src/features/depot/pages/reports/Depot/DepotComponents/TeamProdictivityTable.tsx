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
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="px-4 py-2">ID Equipo</th>
            <th className="px-4 py-2">Nombre Equipo</th>
            <th className="px-4 py-2">Pedidos Completados</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.depotTeamId} className="border-b">
                <td className="px-4 py-2">{item.depotTeamId}</td>
                <td className="px-4 py-2">{item.teamName}</td>
                <td className="px-4 py-2">{item.ordersHandled}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                No hay datos para el rango seleccionado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeamProductivityTable;


