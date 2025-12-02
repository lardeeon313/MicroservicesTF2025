import { Eye, Pencil, User, Mail, Phone, Briefcase, Building2, UserCheck, Users } from "lucide-react";
import { EmployeeDto, EmployeeStatus } from "../types/Employee";
import LoadingSpinner from "../../../components/LoadingSpinner";
import EmptyState from "../../../components/EmptyState";
import { getEmployeeRoleLabel, getEmployeeSectorLabel, getEmployeeStatusLabel } from "../constants/EmployeeLabels";

interface Props {
  employees: EmployeeDto[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  isFiltered?: boolean;
}

export default function EmployeesTable({
  employees,
  loading,
  error,
  onRefetch,
  onView,
  onEdit,
  isFiltered = false,
}: Props) {
  const STATUS_BADGE_CLASSES: Record<EmployeeStatus, string> = {
    [EmployeeStatus.Active]: "bg-green-100 text-green-800 border-green-200",
    [EmployeeStatus.Inactive]: "bg-orange-100 text-orange-800 border-orange-200",
    [EmployeeStatus.OnLicense]: "bg-orange-100 text-orange-800 border-orange-200",
    [EmployeeStatus.Vacation]: "bg-orange-100 text-orange-800 border-orange-200",
    [EmployeeStatus.Dismissed]: "bg-red-100 text-red-800 border-red-200",
    [EmployeeStatus.ResignationProcess]: "bg-red-100 text-red-800 border-red-200",
  };

  if (loading) return (
    <LoadingSpinner message="Cargando empleados..."/>
  );
  
  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={onRefetch} className="btn-primary">Reintentar</button>
      </div>
    );
  
  if (employees.length === 0) 
    return (
      <EmptyState
        icon={Users}
        title={isFiltered ? "No se encontraron empleados" : "No hay empleados registrados"}
        description={isFiltered 
          ? "No hay empleados que coincidan con los criterios de búsqueda. Intentá con otros términos."
          : "Aún no se han registrado empleados en el sistema. Comenzá registrando el primer empleado."
        }
      />
    );

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left"><User className="inline w-4 h-4 mr-1" />Nombre</th>
              <th className="px-4 py-3 text-left"><Mail className="inline w-4 h-4 mr-1" /> Email</th>
              <th className="px-4 py-3 text-left"><Phone className="inline w-4 h-4 mr-1" /> Teléfono</th>
              <th className="px-4 py-3 text-left"><Briefcase className="inline w-4 h-4 mr-1" /> Rol</th>
              <th className="px-4 py-3 text-left"><Building2 className="inline w-4 h-4 mr-1" /> Sector</th>
              <th className="px-4 py-3 text-left"><UserCheck className="inline w-4 h-4 mr-1" /> Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{e.firstName} {e.lastName}</td>
                <td className="px-4 py-2">{e.email}</td>
                <td className="px-4 py-2">{e.phoneNumber}</td>
                <td className="px-4 py-2">{getEmployeeRoleLabel(e.role)}</td>
                <td className="px-4 py-2">{getEmployeeSectorLabel(e.sector)}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${STATUS_BADGE_CLASSES[e.status]}`}
                  >
                    {getEmployeeStatusLabel(e.status)}
                  </span>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button onClick={() => e.id && onView(e.id)} title="Ver">
                    <Eye className="w-5 h-5 text-blue-600 hover:text-gray-700 transition-colors" />
                  </button>
                  <button onClick={() => e.id && onEdit(e.id)} title="Editar">
                    <Pencil className="w-5 h-5 text-yellow-600 hover:text-gray-700 transition-colors" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
