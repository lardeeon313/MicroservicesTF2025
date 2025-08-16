import { useEffect, useState } from "react";
import { SalesPerfomanceDto } from "../types/OrderTypes";
import { getSalesPerfomance } from "../services/OrderService";
import { handleFormikError } from "../../../components/ErrorHandler";
import { parseISO, subDays, subMonths, subYears } from "date-fns";



export function usePerfomanceSalesReport() {
    const [data, setData] = useState<SalesPerfomanceDto[]>([]);
    const [filteredData, setFilteredData] = useState<SalesPerfomanceDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [salesRange, setSalesRange] = useState<"all" | "quincena" | "mensual" | "trimestral" | "semestral" | "anual">("all");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");


    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getSalesPerfomance(dateFrom || undefined, dateTo || undefined);
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
    }, [dateFrom, dateTo]);


    // Filtro en memoria para salesRange y salesPersonName
    useEffect(() => {
    const now = new Date();

    const filtered = data.filter((item) => {
      const orderDate = parseISO(item.lastOrderDate);

      const matchesRange = (() => {
        switch (salesRange) {
          case "quincena":
            return orderDate >= subDays(now, 15);
          case "mensual":
            return orderDate >= subMonths(now, 1);
          case "trimestral":
            return orderDate >= subMonths(now, 3);
          case "semestral":
            return orderDate >= subMonths(now, 6);
          case "anual":
            return orderDate >= subYears(now, 1);
          default:
            return true;
        }
      })();

      return matchesRange;
    });

    setFilteredData(filtered);
    }, [data, salesRange]);

    return {
        data: filteredData,
        loading,
        salesRange,
        setSalesRange,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
    };
};