import { useEffect, useState } from "react";
import { SalesPerfomanceDto } from "../types/OrderTypes";
import { getSalesPerfomance } from "../services/OrderService";
import { handleFormikError } from "../../../components/ErrorHandler";
import { subDays, subMonths, subYears } from "date-fns";

export function usePerfomanceSalesReport() {
    const [data, setData] = useState<SalesPerfomanceDto[]>([]);
    const [filteredData, setFilteredData] = useState<SalesPerfomanceDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [salesRange, setSalesRange] = useState<
        "all" | "quincena" | "mensual" | "trimestral" | "semestral" | "anual"
    >("all");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");

    // Efecto para obtener los datos del backend
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                
                const result = await getSalesPerfomance(dateFrom || undefined, dateTo || undefined, salesRange);
                
                setData(result);
            } catch (error) {
                handleFormikError({ error, customMessages: { 404: "Error al obtener datos", 500: "Error interno" } });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dateFrom, dateTo, salesRange]);

    // Efecto para filtrar los datos según el rango seleccionado
    useEffect(() => {
        const now = new Date();

        const filtered = data.filter((item) => {
            const dateRaw = item.lastOrderDate;
            const orderDate = new Date(dateRaw);

            if (isNaN(orderDate.getTime())) {
                
                return false;
            }

            let limitDate: Date | null = null;
            switch (salesRange) {
                case "quincena":
                    limitDate = subDays(now, 15);
                    break;
                case "mensual":
                    limitDate = subMonths(now, 1);
                    break;
                case "trimestral":
                    limitDate = subMonths(now, 3);
                    break;
                case "semestral":
                    limitDate = subMonths(now, 6);
                    break;
                case "anual":
                    limitDate = subYears(now, 1);
                    break;
                default:
                    limitDate = null;
                    break;
            }
           
            const include = !limitDate || orderDate >= limitDate;
            
            return include;
        });

        
        setFilteredData(filtered);
    }, [data, salesRange]);

    // Retorna `filteredData` y todos los estados y funciones necesarios
    return {
        data, // Datos originales (opcional, si los necesitas para algo más)
        filteredData, // Datos filtrados según el rango seleccionado
        loading,
        salesRange,
        setSalesRange,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
    };
}
