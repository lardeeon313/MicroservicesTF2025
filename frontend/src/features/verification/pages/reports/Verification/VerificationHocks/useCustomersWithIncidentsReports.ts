import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";
import { CustomerIncidentReport } from "../../../../types/Report";

interface Filters {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  incidentType?: string;
}

export const useCustomersWithIncidents = (filters: Filters) => {
  const [data, setData] = useState<CustomerIncidentReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await API.get<CustomerIncidentReport[]>(
        "logistic/LogisticReport/customers-with-incidents",
        { params: filters }
      );

      console.log("CLIENTES CON MAYOR INCIDENCIA " , response)

      setData(response.data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener el reporte de incidencias");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // ahora se ejecuta siempre al montar o cambiar filtros
  }, [filters]);

  return { data, isLoading, error };
};
