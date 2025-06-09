import React from "react";
import type { DepotTeam } from "../../../../depotmanager/types/DepotTeamTypes";


type Props = {
  data: { teamId: DepotTeam['id']; completedOrders: number }[];
};


const TeamProdictivityTable: React.FC<Props> = ({data}) => {
    return(
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow rounded-lg">
                <thead className="bg-gray-200 text-gray-700">
                    <tr>
                        <th className="px-4 py-2 text-left">Equipo</th>
                        <th className="px-4 py-2 text-left">Pedidos Completados</th>
                    </tr>
                </thead>
            <tbody>
            {data.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                    <td className="px-4 py-2">{item.teamId}</td>
                    <td className="px-4 py-2">{item.completedOrders}</td>
                </tr>
            ))}
            </tbody>
            </table>
        </div>
    )
}

export default TeamProdictivityTable;

