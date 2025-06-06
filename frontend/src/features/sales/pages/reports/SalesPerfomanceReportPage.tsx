import { Link } from "react-router-dom";
import { usePerfomanceSalesReport } from "../../hooks/usePerfomanceSalesReport"
import { SalesPerfomanceReportTable } from "../../components/Reports/PerfomanceSalesReport/SalesPerfomanceReportTable";
import { GraphSalesPerfomanceReport } from "../../components/Reports/PerfomanceSalesReport/GraphSalesPerfomanceReport";




export const SalesPerfomanceReportPage = () => {
    const {
        data,
        loading,
        salesPersonName,
        setSalesPersonName,
        period,
        setPeriod,
    } = usePerfomanceSalesReport();

    return ( 
        <div className="container m-0 pt-10 min-w-full min-h-full">
            <div className="flex items-center justify-between mb-6">
                <Link to="/sales/reports/dashboard" className="text-red-600 hover:underline pl-10">
                    ← Volver atras 
                </Link>
            </div>
            <div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Rendimiento de Ventas</h1>
                <p className="text-center text-lg text-gray-700 mb-12">
                    Se visualiza el rendimiento de todos los encargados de ventas
                </p>
                <div className="flex flex-col md:flex-row mb-4 w-full justify-between">
                    <input
                        type="text"
                        placeholder="Filtrar por Nombre"
                        className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-400 focus:transition-colors focus:duration-500 outline-gray-200 "
                        value={salesPersonName}
                        onChange={(e) => setSalesPersonName(e.target.value)}
                    />
                    <select
                        className="select border w-2/12 border-gray-300 rounded px-3 py-2  focus:outline-gray-400 focus:transition-colors focus:duration-500 outline-gray-200"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as "weekly" | "monthly" | "yearly")}
                    >
                        <option value="weekly">Última semana</option>
                        <option value="monthly">Último mes</option>
                        <option value="yearly">Último año</option>
                    </select>
                </div>
                <SalesPerfomanceReportTable data={data} loading={loading}/>
                <GraphSalesPerfomanceReport data={data}/>
            </div>
            </div>
        </div>
    )
}