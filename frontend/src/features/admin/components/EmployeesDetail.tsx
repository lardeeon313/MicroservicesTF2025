import { Link } from "react-router-dom";
import { EmployeeDto } from "../types/Employee";
import { getEmployeeRoleLabel, getEmployeeSectorLabel, getEmployeeStatusLabel } from "../constants/EmployeeLabels";

interface Props {
  employee: EmployeeDto;
}

const EmployeesDetail = ({ employee }: Props) => {
  return (
    <div className="space-y-6 container mx-auto py-10 px-16 sm:max-w-6xl">
      <label className="block text-sm font-medium text-gray-900 mb-1">Nombre de Usuario</label>
      <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
        {employee.userName}
      </p>
      
      <label className="block text-sm font-medium text-gray-900 mb-1">Nombre Completo</label>
      <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
        {employee.firstName} {employee.lastName}
      </p>
  
      
      <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
      <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
        {employee.email}
      </p>
      
      <label className="block text-sm font-medium text-gray-900 mb-1">Teléfono</label>
      <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
        {employee.phoneNumber}
      </p>
      
      <label className="block text-sm font-medium text-gray-900 mb-1">Rol</label>
      <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
        {getEmployeeRoleLabel(employee.role)}
      </p>
      
      <label className="block text-sm font-medium text-gray-900 mb-1">Sector</label>
      <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
        {getEmployeeSectorLabel(employee.sector)}
      </p>
      
      <label className="block text-sm font-medium text-gray-900 mb-1">Estado</label>
      <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
        {getEmployeeStatusLabel(employee.status)}
      </p>

      {employee.createdAt && (
        <>
          <label className="block text-sm font-medium text-gray-900 mb-1">Fecha de Creación</label>
          <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">
            {new Date(employee.createdAt).toLocaleDateString('es-AR')}
          </p>
        </>
      )}

      <div className="mt-10">
        <Link
          to={`/admin/employees/edit/${employee.id}`}
          className="flex w-full justify-center items-center rounded-md bg-red-700 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-red-600 transition duration-150 disabled:opacity-50"
        >
          Editar Empleado
        </Link>
      </div>
    </div>
  );
};

export default EmployeesDetail;
