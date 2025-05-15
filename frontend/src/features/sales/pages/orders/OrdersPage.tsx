import { useNavigate } from "react-router-dom";
import OrderTable from "../../components/Orders/OrderTable";
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Header from "../../components/Header";
import { usePagedOrders } from "../../hooks/usePagedOrders";
import { deleteOrder } from "../../services/OrderService";

export default function OrdersPage() {
    const [searchId, setSearchId]  = useState("");
    const [searchCustomer, setSearchCustomer] = useState(""); 
    const navigate = useNavigate();
    const pageSize = 20;
    const [page, setPage] = useState(1);
    const { orders, loading, error, totalPages, refetch } = usePagedOrders(page, pageSize);



    const filteredOrders = orders.filter((order) => {
        const idMatch = order.id.toString().includes(searchId.toLowerCase());
        const nameMatch = `${order.customerFirstName?? ''} ${order.customerLastName?? ''}`
        .toLowerCase()
        .includes(searchCustomer.toLowerCase());
        return idMatch && nameMatch;
    })

    const handleDelete = async (id: number) => {
      const confirmResult = await Swal.fire({
        title: "¿Estás seguro que quieres eliminar el pedido?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
      });

      if (!confirmResult.isConfirmed) return;

      const reasonResult = await Swal.fire({
        title: "Motivo de la eliminación",
        input: "text",
        inputPlaceholder: "Escribe el motivo...",
        inputValidator: (value) => {
          if (!value) {
            return "Debes ingresar un motivo.";
          }
          if (value.length > 200) {
            return "El motivo no debe exceder los 200 caracteres.";
          }
          return null;
        },
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      });

      if (reasonResult.isConfirmed && reasonResult.value) {
        try {
          await deleteOrder(id, {
            orderId: id,
            reason: reasonResult.value,
          });

          await Swal.fire("¡Listo!", `Se eliminó el pedido #${id}`, "success");
          refetch(); // actualiza la tabla
        } catch (error) {
          console.error("Error al eliminar:", error);
          Swal.fire("Error", "No se pudo eliminar el pedido. Intenta de nuevo.", "error");
        }
      }
    };

      const handleActionChange = (action: string, id: number) => {
    if (action === "emitir") {
      Swal.fire("Pedido Emitido", `El pedido #${id} fue emitido.`, "success");
    } else if (action === "cancelar") {
      Swal.fire("Pedido Cancelado", `El pedido #${id} fue cancelado.`, "info");
    }
  };

  return (
    <div className="p-4">
      <Header />
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por ID"
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Buscar por Cliente"
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2"
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
        />
      </div>

      <OrderTable
        orders={filteredOrders}
        loading={loading}
        error={error}
        onRefetch={refetch}
        onView={(id) => navigate(`/orders/view/${id}`)}
        onEdit={(id) => navigate(`/orders/update/${id}`)}
        onDelete={handleDelete}
        onActionChange={handleActionChange}
      />

      {/* Paginación */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-gray-700 mt-2">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

    </div>
  );
}
