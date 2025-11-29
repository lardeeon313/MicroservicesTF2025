import React, { useState } from "react";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import TeamProductivityTable from "../DepotComponents/TeamProdictivityTable";

import { useTeamProductivity } from "../DepotHocks/useTeamProdictivity";
import TeamProductivityDateFilter from "../DepotFilters/TeamProdictivityFilter";
import BackButton from "../../../../../../components/BackButton";

type DepotTeamPerformance = {
  depotTeamId: number;
  teamName?: string;
  ordersHandled: number;
  missingItemsReported: number;
  averageProcessingTimeMinutes: number;
};

const TeamProductivityPage: React.FC = () => {

  const today = new Date().toISOString().split("T")[0];

  // valores que el usuario “edita”
  const [tempFrom, setTempFrom] = useState(today);
  const [tempTo, setTempTo] = useState(today);
  const [filterType, setFilterType] =
    useState<"day" | "month" | "quincena" | "range">("range");

  // valores “reales” de búsqueda
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);

  const { data = [], loading, error } = useTeamProductivity(from, to);

  const handleFilterTypeChange = (type: "day" | "month" | "quincena" | "range") => {
    setFilterType(type);

    const current = new Date();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const y = current.getFullYear();
    const d = String(current.getDate()).padStart(2, "0");

    if (type === "day") {
      const t = `${y}-${m}-${d}`;
      setTempFrom(t);
      setTempTo(t);
    }

    if (type === "month") {
      const first = `${y}-${m}-01`;
      const last = `${y}-${m}-${new Date(y, current.getMonth() + 1, 0).getDate()}`;
      setTempFrom(first);
      setTempTo(last);
    }

    if (type === "quincena") {
      setTempFrom(`${y}-${m}-01`);
      setTempTo(`${y}-${m}-15`);
    }
  };

  // 👉 Botón BUSCAR
  const handleSearch = () => {
    setFrom(tempFrom);
    setTo(tempTo);
  };

  // 👉 Botón LIMPIAR
  const handleReset = () => {
    setFilterType("day");

    const clean = today;

    setTempFrom(clean);
    setTempTo(clean);
    setFrom(clean);
    setTo(clean);
  };

  const tableData = (data as DepotTeamPerformance[]).map((i) => ({
    depotTeamId: i.depotTeamId,
    teamName: i.teamName ?? "Equipo sin nombre",
    ordersHandled: i.ordersHandled,
    missingItemsReported: i.missingItemsReported,
    averageProcessingTimeMinutes: Number(((i.averageProcessingTimeMinutes / 1000) / 3600).toFixed(2))
  }));

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/reports" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Productividad de los equipos de depósito
          </h1>
          <h2 className="text-center text-lg text-gray-700 mb-12">
            Aquí podés gestionar qué tanto se desempeñaron los equipos asignados.
          </h2>
        </div>

        {/* FILTROS */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-10">
          <TeamProductivityDateFilter
            filterType={filterType}
            onFilterTypeChange={handleFilterTypeChange}
            from={tempFrom}
            to={tempTo}
            onFromChange={setTempFrom}
            onToChange={setTempTo}
          />

          {/* BOTONES */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600"
              onClick={handleSearch}
            >
              Buscar
            </button>

            <button
              className="px-6 py-2 bg-gray-300 text-gray-900 rounded-xl shadow hover:bg-gray-400"
              onClick={handleReset}
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* TABLA */}
        {loading ? (
          <LoadingSpinner
            message="Cargando los datos... por favor espere"
            height="h-screen"
          />
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <TeamProductivityTable data={tableData} />
        )}
      </div>
    </div>
  );
};

export default TeamProductivityPage;
