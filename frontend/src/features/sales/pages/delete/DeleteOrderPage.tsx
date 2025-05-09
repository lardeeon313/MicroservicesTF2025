"use client"

import type React from "react"

import Swal from "sweetalert2"
import { OrderProps } from "../../components/Order"

// Función para manejar la eliminación de un pedido
export const DeleteOrderPage = (
  orderId: string,
  orders: OrderProps[],
  setOrders: React.Dispatch<React.SetStateAction<OrderProps[]>>,
) => {
  Swal.fire({
    title: "¿Seguro que quiere eliminar el pedido?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "No, cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Filtrar el pedido eliminado
      const updatedOrders = orders.filter((order) => order.id !== orderId)
      setOrders(updatedOrders)

      Swal.fire("¡Eliminado!", "El pedido ha sido eliminado.", "success")
    }
  })
}
