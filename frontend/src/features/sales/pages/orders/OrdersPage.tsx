import { useNavigate } from "react-router-dom";
import OrderTable from "../../components/Orders/OrderTable";
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { usePagedOrders } from "../../hooks/usePagedOrders";
import { deleteOrder, updateOrderStatus } from "../../services/OrderService";
import { OrderStatus } from "../../types/OrderTypes";
import { handleFormikError } from "../../../../components/ErrorHandler";
import { Pagination } from "../../../../components/Pagination";
import BackButton from "../../../../components/BackButton";
import { OrderStatusLabels } from "../../constants/OrderStatusLabel";

export default function OrdersPage() {
    const [searchId, setSearchId]  = useState("");
    const [searchCustomer, setSearchCustomer] = useState(""); 
    const navigate = useNavigate();
    const pageSize = 20;
    const [page, setPage] = useState(1);
    const { orders, loading, error, totalPages, refetch } = usePagedOrders(page, pageSize);

    const editableStatuses = [
      OrderStatus.Pending,
      OrderStatus.PendingResolution,
      OrderStatus.PendingReissued,
    ];

    const getStatusLabel = (status: OrderStatus) => OrderStatusLabels[status] ?? status;



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

      if (!editableStatuses.includes(order.status)) {
        return Swal.fire("Acción no permitida", `Solo puedes eliminar órdenes en estado "${OrderStatusLabels[OrderStatus.Pending]}", "${OrderStatusLabels[OrderStatus.PendingResolution]}" o "${OrderStatusLabels[OrderStatus.PendingReissued]}".`, "warning");
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

        if (!editableStatuses.includes(order.status)) {
          return Swal.fire("Acción no permitida", `Solo puedes cambiar estado cuando la órden está en "${OrderStatusLabels[OrderStatus.Pending]}", "${OrderStatusLabels[OrderStatus.PendingResolution]}" o "${OrderStatusLabels[OrderStatus.PendingReissued]}".`, "warning");
        }

        const statusMap: Record<string ,OrderStatus> = {
          emitir: OrderStatus.Issued,
          cancelar: OrderStatus.Canceled,
          pendiente: OrderStatus.Pending
        };

        if (order.status === statusMap[action]) {
          return Swal.fire("Acción no permitida", `La órden ya se encuentra en "${getStatusLabel(order.status)}".`, "info" )
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
            console.log("Response from updateOrderStatus:", {
            orderId: id,
            status: newStatus
          });
          await updateOrderStatus(id, {
            orderId: id,
            status: newStatus
          });
          Swal.fire(
            "Estado actualizado",
            `El pedido #${id} fue marcado como "${getStatusLabel(newStatus)}".`,
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

        if (!editableStatuses.includes(order.status)) {
          return Swal.fire("Acción no permitida", `Solo puedes editar órdenes en estado "${OrderStatusLabels[OrderStatus.Pending]}", "${OrderStatusLabels[OrderStatus.PendingResolution]}" o "${OrderStatusLabels[OrderStatus.PendingReissued]}".`, "warning");
        }
        navigate(`/sales/orders/update/${id}`);
      };


  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/home"></BackButton>
        <h1 className="text-center text-4xl font-bold text-red-600 mb-12">Gestión de Pedidos</h1>
        <div className="flex items-center justify-end mb-6">
          <BackButton to="/sales/orders/registerOrder" label="Registrar Nuevo Pedido"></BackButton>
        </div>
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

        {/* Paginación */}
        <div className="flex justify-center mt-6 gap-4 ">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
        </div>
      </div>
    </div>
  );
}
