import { useCallback, useEffect, useState } from "react";
import { EmployeeDto, EmployeeStatus, EmployeeSector } from "../types/Employee";
import { getAllEmployees, getEmployeesByStatus, getEmployeesBySector } from "../services/EmployeeService";
import { handleFormikError } from "../../../components/ErrorHandler";

export function useEmployees(statusFilter?: EmployeeStatus, sectorFilter?: EmployeeSector) {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result: EmployeeDto[];
      if (statusFilter) {
        result = await getEmployeesByStatus(statusFilter);
      } else if (sectorFilter) {
        result = await getEmployeesBySector(sectorFilter);
      } else {
        result = await getAllEmployees();
      }
      
      setEmployees(result);
    } catch (err) {
      const errorMessage = "Error al cargar los empleados";
      setError(errorMessage);
      handleFormikError({
        error: err,
        customMessages: {
          400: "Datos inválidos, por favor verificá los campos",
          404: "Empleados no encontrados",
          500: "Error interno del servidor",
        },
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sectorFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { employees, loading, error, refetch: fetchData };
}

