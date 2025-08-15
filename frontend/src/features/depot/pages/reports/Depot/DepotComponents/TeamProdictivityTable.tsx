import React from "react";
import type { DepotTeam } from "../../../../depotmanager/types/DepotTeamTypes";

type Props = {
  data: { teamId: DepotTeam["id"]; completedOrders: number }[];
};

const TeamProductivityTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="px-4 py-2">ID Equipo</th>
            <th className="px-4 py-2">Pedidos Completados</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.teamId} className="border-b">
                <td className="px-4 py-2">{item.teamId}</td>
                <td className="px-4 py-2">{item.completedOrders}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="px-4 py-6 text-center text-gray-500">
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


