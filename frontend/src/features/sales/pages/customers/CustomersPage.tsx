import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { handleFormikError } from "../../../../components/ErrorHandler";
import { deleteCustomer } from "../../services/CustomerService";
import { usePagedCustomers } from "../../hooks/usePagedCustomers";
import CustomerTable from "../../components/Customers/CustomersTable";
import { Pagination } from "../../../../components/Pagination";


export default function CustomersPage() {
    const [searchAddress, setSearchAddress] = useState("");
    const [searchName, setSearchName] = useState("");
    const navigate = useNavigate();
    const pageSize = 20; 
    const [page, setPage] = useState (1);
    const { customers, loading, error, totalPages, refetch } = usePagedCustomers(page, pageSize);


    const filteredCustomers = customers.filter((c) => {
        const addressMatch = `${c.address ?? ""}`
            .includes(searchAddress.toLowerCase());
        const nameMatch = `${c.firstName ?? ""} ${c.lastName ?? ""} ${c.email ?? ""}`
            .toLowerCase()
            .includes(searchName.toLowerCase());
        return addressMatch && nameMatch;
    })

    const handleDelete = async (id: string) => {
        const customer = customers.find((c) => c.id === id);
        if (!customer) return;

        const confirmResult = await Swal.fire({
            title: "¿Eliminar cliente?",
            text: `¿Seguro que quieres eliminar a ${customer.firstName} ${customer.lastName}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })

        if (!confirmResult.isConfirmed) return;

        try {
            await deleteCustomer(id);
            await Swal.fire("Eliminado", "El cliente ha sido eliminado.", "success");
            refetch();
        } catch (error) {
            handleFormikError({
                error,
                customMessages: {
                    500: "Error interno al eliminar el cliente",
                    404: "Cliente no encontrado"
                },
            });
        };
    };

    const handleView = (id:string) => {
        navigate(`/sales/customer/viewCustomer/${id}`);
    }

    const handleEdit = (id:string) => {
        navigate(`/sales/customer/update/${id}`);
    }

return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="flex items-center justify-between mb-6">
        <Link to="/sales" className="text-red-600 hover:underline pl-10">
          ← Volver al menú principal
        </Link>
      </div>
      <div className="container mx-auto py-10 px-16 sm:max-w-7xl">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-12">Gestión de Clientes</h1>
        <div className="flex flex-col md:flex-row mb-4 w-full justify-between">
          <input
            type="text"
            placeholder="Buscar por Dirección"
            className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-500"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Buscar por nombre"
            className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-500"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <CustomerTable
          customers={filteredCustomers}
          loading={loading}
          error={error}
          onRefetch={refetch}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="flex items-center justify-end py-4 px-6">
          <Link to="/sales/customer/registerCustomer" className="text-red-600 hover:underline">
            Registrar Nuevo Cliente
          </Link>
        </div>

        <div className="flex justify-center mt-6 gap-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
        </div>
      </div>
    </div>
  );


}