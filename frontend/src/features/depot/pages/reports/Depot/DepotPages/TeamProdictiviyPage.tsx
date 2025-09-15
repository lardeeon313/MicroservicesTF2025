import React, { useState } from "react";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import TeamProductivityTable from "../DepotComponents/TeamProdictivityTable";
import TeamProdictivityGraph from "../DepotGraph/GraphTeamProdictivity";
import { useTeamProductivity } from "../DepotHocks/useTeamProdictivity";
import TeamProductivityDateFilter from "../DepotFilters/TeamProdictivityFilter";
import BackButton from "../../../../../../components/BackButton";

// 🔹 Tipo que devuelve el back (según API real)
type DepotTeamPerformance = {
  depotTeamId: number;
  teamName?: string;
  ordersHandled: number;
  missingItemsReported: number;
  averageProcessingTimeMinutes: number;
};

// 🔹 Tipo que necesita el gráfico y la tabla
type ProductivityProps = {
  teamID: number;
  completedOrders: number;
  missingItemsReported: number;
  averageProcessingTimeMinutes: number;
};

const TeamProductivityPage: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState<string>(today);
  const [to, setTo] = useState<string>(today);

  const { data = [], loading, error } = useTeamProductivity(from, to);

  // Adaptamos los nombres a los que realmente devuelve el back
  const GraphData: ProductivityProps[] = (data as DepotTeamPerformance[]).map(
    (item) => ({
      teamID: item.depotTeamId,
      completedOrders: item.ordersHandled,
      missingItemsReported: item.missingItemsReported,
      averageProcessingTimeMinutes: item.averageProcessingTimeMinutes,
    })
  );

  if (loading) {
    return (
      <LoadingSpinner
        message="Cargando los datos... por favor espere"
        height="h-screen"
      />
    );
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/reports"></BackButton>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Productividad de los equipos de depósito
          </h1>
          <h2 className="text-center text-lg text-gray-700 mb-12">
            Aquí podés gestionar qué tanto se desempeñaron los equipos asignados.
          </h2>
        </div>
        <TeamProductivityDateFilter
              from={from}
              to={to}
              onFromChange={setFrom}
              onToChange={setTo}
        />


          {error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : (
            <>
              <TeamProductivityTable data={data} />
              <TeamProdictivityGraph data={GraphData} />
            </>
          )}
      </div>
    </div>
  );
};

export default TeamProductivityPage;
