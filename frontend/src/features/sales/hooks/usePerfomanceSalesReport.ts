import { useEffect, useState } from "react";
import { SalesPerfomanceDto } from "../types/OrderTypes";
import { getSalesPerfomance } from "../services/OrderService";
import { handleFormikError } from "../../../components/ErrorHandler";
import { isWithinInterval, parseISO, subDays, subMonths, subYears } from "date-fns";



export function usePerfomanceSalesReport() {
    const [data, setData] = useState<SalesPerfomanceDto[]>([]);
    const [filteredData, setFilteredData] = useState<SalesPerfomanceDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [salesPersonName, setSalesPersonName] = useState("");
    const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");


    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getSalesPerfomance();
            setData(result);
        } catch (error) {
            handleFormikError({
                error,
                customMessages: {
                    404: "Error al obtener datos del rendimiento",
                    500: "Error interno del servidor",
                },
            })
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);


    // Aplicamos los filtros en el frontend
    useEffect(() => {
        const now = new Date();
        const periodStart = 
            period === "weekly"
            ? subDays(now, 7)
            : period === "monthly"
            ? subMonths(now, 1)
            : subYears(now, 1);


        const filtered = data.filter((item) => {
        const matchName = salesPersonName
            ? item.salespersonName.toLowerCase().toLowerCase().includes(salesPersonName.toLowerCase())
            : true;

        const orderDate = parseISO(item.lastOrderDate);
        const matchDate = isWithinInterval(orderDate, { start: periodStart, end: now});

        return matchName && matchDate;
        });

        setFilteredData(filtered);
    }, [data, salesPersonName, period]);

    return {
        data:filteredData,
        loading,
        salesPersonName,
        setSalesPersonName,
        period,
        setPeriod,
    };
};