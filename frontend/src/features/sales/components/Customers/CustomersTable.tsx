import { Eye, Pencil, Trash, User, Mail, Phone, MapPin } from "lucide-react";
import { CustomerResponse } from "../../types/CustomerTypes";
import LoadingSpinner from "../../../../components/LoadingSpinner";


interface Props {
  customers: CustomerResponse[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CustomerTable({
  customers,
  loading,
  error,
  onRefetch,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (loading) return (
    <LoadingSpinner message="Cargando clientes..."/>
    )
  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={onRefetch} className="btn-primary">Reintentar</button>
      </div>
    );
  if (customers.length === 0) return <div className="text-center py-8 text-gray-500">No hay clientes registrados.</div>;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left"><User className="inline w-4 h-4 mr-1" />Nombre</th>
              <th className="px-4 py-3 text-left"><Mail className="inline w-4 h-4 mr-1" /> Email</th>
              <th className="px-4 py-3 text-left"><Phone className="inline w-4 h-4 mr-1" /> Teléfono</th>
              <th className="px-4 py-3 text-left"><MapPin className="inline w-4 h-4 mr-1" /> Dirección</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{c.firstName} {c.lastName}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.phoneNumber}</td>
                <td className="px-4 py-2">{c.address}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button onClick={() => onView(c.id)} title="Ver">
                    <Eye className="w-5 h-5 text-blue-600 hover:text-gray-700 transition-colors" />
                  </button>
                  <button onClick={() => onEdit(c.id)} title="Editar">
                    <Pencil className="w-5 h-5 text-yellow-600 hover:text-gray-700 transition-colors" />
                  </button>
                  <button onClick={() => onDelete(c.id)} title="Eliminar">
                    <Trash className="w-5 h-5 text-red-600 hover:text-gray-700 transition-colors" />
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
