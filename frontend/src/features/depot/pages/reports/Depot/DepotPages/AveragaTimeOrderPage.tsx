import React from "react";
import AverageTimeOrderTable from "../DepotComponents/AverageTimeOrderTable";
import { useAverageTimeOrder } from "../DepotHocks/useAverageTimeOrder";

const AverageTimeOrderPage: React.FC = () => {
    const {armtime, loading, error} = useAverageTimeOrder();

    if (loading) return <div className="p-4">Cargando...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return(
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Promedio de tiempo de armado:</h2>
            <AverageTimeOrderTable armTime={armtime} />
        </div>
    )
}

export default AverageTimeOrderPage;