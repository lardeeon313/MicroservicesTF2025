import React from "react";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Legend,} from "recharts";
import type { DepotTeam } from "../../../../depotmanager/types/DepotTeamTypes";


type Props = {
    data: { teamID: DepotTeam['id'] , completedOrders: number }[];
}

const TeamProdictivityGraph: React.FC<Props>  = ({data}) => {
    return(
    <div className="w-full h-80 bg-white rounded-lg shadow p-4 mt-6">
      <h3 className="text-xl font-semibold mb-4">Gráfico de Productividad por Equipo</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="teamId" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="completedOrders" name="Pedidos Completados" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    )
}

export default TeamProdictivityGraph;