import React from "react";
import { useDailyMissing } from "../DepotHocks/useDailiyMissing";
import DailyMissingTable from "../DepotComponents/DailyMissingTable";

//renderiza tanto el componente como el hock:

const DailyMissingPage: React.FC = () => {
    const {data,loading} = useDailyMissing();

    return(
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reporte de Faltantes Diarios</h1>
      {loading ? (
        <p className="text-gray-600">Cargando datos...</p>
      ) : (
        <DailyMissingTable data={data} />
      )}
    </div>
    )
}

export default DailyMissingPage;
