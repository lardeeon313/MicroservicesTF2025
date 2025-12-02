import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../hooks/useEmployees";
import EmployeesTable from "../components/EmployeesTable";
import BackButton from "../../../components/BackButton";
import { EmployeeStatus, EmployeeSector } from "../types/Employee";
import { getEmployeeSectorLabel, getEmployeeStatusLabel } from "../constants/EmployeeLabels";

export default function EmployeesPage() {
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "">("");
  const [sectorFilter, setSectorFilter] = useState<EmployeeSector | "">("");
  const navigate = useNavigate();
  
  const { employees, loading, error, refetch } = useEmployees(
    statusFilter ? (statusFilter as EmployeeStatus) : undefined,
    !statusFilter && sectorFilter ? (sectorFilter as EmployeeSector) : undefined
  );

  const filteredEmployees = employees.filter((employee) => {
    const searchText = `${employee.firstName ?? ""} ${employee.lastName ?? ""} ${employee.email ?? ""} ${employee.userName ?? ""}`
      .toLowerCase();
    return searchText.includes(searchName.toLowerCase());
  });

  const handleView = (id: number) => {
    navigate(`/admin/employees/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/employees/edit/${id}`);
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/dashboard"></BackButton>
        <h1 className="text-center text-4xl font-bold text-red-600 mb-12">Gestión de Empleados</h1>
        <div className="flex flex-col md:flex-row mb-4 w-full justify-between gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre, email o usuario"
            className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-500 flex-1"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-500"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as EmployeeStatus | "");
              // Si se selecciona un estado, reseteamos el filtro de sector
              if (e.target.value) {
                setSectorFilter("");
              }
            }}
          >
            <option value="">Todos los estados</option>
            {Object.values(EmployeeStatus).map((status) => (
              <option key={status} value={status}>
                {getEmployeeStatusLabel(status)}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-500"
            value={sectorFilter}
            onChange={(e) => {
              setSectorFilter(e.target.value as EmployeeSector | "");
              // Si se selecciona un sector, reseteamos el filtro de estado
              if (e.target.value) {
                setStatusFilter("");
              }
            }}
          >
            <option value="">Todos los sectores</option>
            {Object.values(EmployeeSector).map((sector) => (
              <option key={sector} value={sector}>
                {getEmployeeSectorLabel(sector)}
              </option>
            ))}
          </select>
        </div>

        <EmployeesTable
          employees={filteredEmployees}
          loading={loading}
          error={error}
          onRefetch={refetch}
          onView={handleView}
          onEdit={handleEdit}
          isFiltered={employees.length > 0 && filteredEmployees.length === 0}
        />

        <div className="flex items-center justify-end py-4">
          <BackButton to="/admin/employees/register" label="Registrar Nuevo Empleado"></BackButton>
        </div>
      </div>
    </div>
  );
}
