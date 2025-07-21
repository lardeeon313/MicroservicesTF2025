import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../../../../../../components/Pagination";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import TeamProdictivityTable from "../DepotComponents/TeamProdictivityTable";
import TeamProdictivityGraph from "../DepotGraph/GraphTeamProdictivity";
import { useTeamProdictivity } from "../DepotHocks/useTeamProdictivity";
import TeamProdictivityFilter from "../DepotFilters/TeamProdictivityFilter"; // ✅ nuevo filtro

const TeamProdictivityPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const [idfilter, setidFilter] = useState("");
  const [minOrders, setMinOrders] = useState<number | "">("");
  const [maxOrders, setMaxOrders] = useState<number | "">("");

  const { data, loading, error, totalpages } = useTeamProdictivity(page, pageSize);

  const filteredData = data.filter((item) => {
    const matchesId = item.teamId.toString().includes(idfilter);
    const matchesMin = minOrders === "" || item.completedOrders >= minOrders;
    const matchesMax = maxOrders === "" || item.completedOrders <= maxOrders;
    return matchesId && matchesMin && matchesMax;
  });

  const GraphData = filteredData.map((item) => ({
    teamID: item.teamId,
    completedOrders: item.completedOrders,
  }));

  if (loading) {
    return <LoadingSpinner message="Cargando los datos...por favor espere" height="h-screen" />;
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

        {/**codgio de los filtros:  */}

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6 mb-8 justify-center">
          <div className="w-full max-w-[350px] p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Filtrar por ID de equipo</label>
              <input
                type="text"
                placeholder="Ej: 23"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                value={idfilter}
                onChange={(e) => setidFilter(e.target.value)}
              />
            </div>
          </div>

          <TeamProdictivityFilter
          minOrders={minOrders}
          maxOrders={maxOrders}
          onMinChange={setMinOrders}
          onMaxChange={setMaxOrders}
          />
        </div>

        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <>
            <TeamProdictivityTable data={filteredData} />
            <TeamProdictivityGraph data={GraphData} />
            <Pagination currentPage={page} totalPages={totalpages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default TeamProdictivityPage;
