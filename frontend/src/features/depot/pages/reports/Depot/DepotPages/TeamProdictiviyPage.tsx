import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
//import TeamProductivityTable from "../DepotComponents/TeamProductivityTable";
import TeamProductivityTable from "../DepotComponents/TeamProdictivityTable";
import TeamProdictivityGraph from "../DepotGraph/GraphTeamProdictivity";
import { useTeamProductivity } from "../DepotHocks/useTeamProdictivity";
import TeamProductivityDateFilter from "../DepotFilters/TeamProdictivityFilter";

const TeamProductivityPage: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState<string>(today);
  const [to, setTo] = useState<string>(today);

  const { data, loading, error } = useTeamProductivity(from, to);

  const GraphData = data.map((item) => ({
    teamID: item.teamId,
    completedOrders: item.completedOrders,
  }));

  if (loading) {
    return <LoadingSpinner message="Cargando los datos... por favor espere" height="h-screen" />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Link to={"/depot"} className="text-blue-600 hover:underline font-medium">
          ← Volver al depósito
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Productividad de los equipos de depósito
        </h1>
        <h2 className="text-center text-lg text-gray-700 mb-12">
          Aquí podés gestionar qué tanto se desempeñaron los equipos asignados.
        </h2>

        <div className="flex justify-center mb-8">
          <TeamProductivityDateFilter from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
        </div>

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
