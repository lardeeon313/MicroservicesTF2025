import { Link, useNavigate } from "react-router-dom";
import OrderTable from "../../components/Orders/OrderTable";
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { usePagedOrders } from "../../hooks/usePagedOrders";
import { deleteOrder, updateOrderStatus } from "../../services/OrderService";
import { OrderStatus } from "../../types/OrderTypes";
import { handleFormikError } from "../../../../components/ErrorHandler";
import { Pagination } from "../../../../components/Pagination";

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
      const order = orders.find((o) => o.id === id);
      if (!order) return;

      if (order.status === OrderStatus.Confirmed) {
        return Swal.fire("Acción no permitida", "No se puede eliminar una orden ya fue confirmada por Deposito.", "warning");
      }

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

      const handleActionChange = async (action: string, id: number) => {
        const order = orders.find((o) => o.id === id);
        if (!order) return;

        if (order.status === OrderStatus.Issued) {
          return Swal.fire("Acción no permitida", "No se puede modificar una orden ya emitida.", "warning");
        }

        if (order.status === OrderStatus.Canceled) {
          return Swal.fire("Acción no permitida", "No se puede cambiar el estado de un pedido ya cancelado", "warning")
        }

        const statusMap: Record<string ,OrderStatus> = {
          emitir: OrderStatus.Issued,
          cancelar: OrderStatus.Canceled,
          pendiente: OrderStatus.Pending
        };

        if (order.status === statusMap[action]) {
          return Swal.fire("Accion no permitida", "La órden ya se encuentra en ese estado.", "info" )
        }

        const confirmResult = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Esta acción no se puede deshacer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, continuar",
          cancelButtonText: "Cancelar",
        });

        if (!confirmResult.isConfirmed) return;


        const newStatus = statusMap[action];
        if (!newStatus) return;

        try {
          await updateOrderStatus(id, {
            orderId: id,
            status: newStatus
          });
          Swal.fire(
            "Estado actualizado",
            `El pedido #${id} fue marcado como "${newStatus}".`,
            "success"
          );
          refetch(); // Actualiza la pagina
        } catch (error) {
          handleFormikError({
            error,
            customMessages: {
              500: "Error interno del servidor",
              404: "No se pudo actualizar el estado del pedido"
            }
          })
        }
      };

      const handleView = (id: number) => {
        navigate(`/sales/orders/view/${id}`);
      };
      
      const handleEdit = (id: number) => {
        const order = orders.find((o) => o.id === id);
        if (!order) return;

        if (order.status === OrderStatus.Issued) {
          return Swal.fire("Acción no permitida", "No se puede editar una orden ya emitida.", "warning");
        }

        navigate(`/sales/orders/update/${id}`);
      };


  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="flex items-center justify-between mb-6">
        <Link to="/sales" className="text-red-600 hover:underline pl-10">
          ← Volver al menu principal
        </Link>
      </div>
      <div className="container mx-auto py-10 px-16 sm:max-w-7xl">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-12">Gestión de Pedidos</h1>
        <div className="flex flex-col md:flex-row mb-4 w-full justify-between">
          <input
            type="text"
            placeholder="Buscar por ID"
            className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-400 focus:transition-colors focus:duration-500 outline-gray-200 "
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Buscar por Cliente"
            className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-400 focus:transition-colors focus:duration-500 outline-gray-200"
            value={searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
          />
        </div>

        <OrderTable
          orders={filteredOrders}
          loading={loading}
          error={error}
          onRefetch={refetch}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onActionChange={handleActionChange}
        />

        <div className="flex items-center justify-end py-4 px-6">
          <Link to="/sales/orders/registerOrder" className="text-red-600 hover:underline">
            Registrar Nuevo Pedido
          </Link>
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-6 gap-4 ">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
        </div>

      </div>
    </div>
  );
}
