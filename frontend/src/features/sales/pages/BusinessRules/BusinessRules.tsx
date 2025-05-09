"use client"

//import type { OrderStatus } from "../types/OrderStatus"
import type { OrderStatus } from "../../components/Order"
import type React from "react"

interface BusinessRulesProps {
  estado: OrderStatus
  children: React.ReactNode
  actionType: "update" | "delete" | "view"
}

export const BusinessRules: React.FC<BusinessRulesProps> = ({ estado, children, actionType }) => {
  const isConfirmed = estado === "Confirmado"
  const isDisabled = isConfirmed && (actionType === "update" || actionType === "delete")

  if (!isDisabled) {
    return <>{children}</>
  }

  // Versión simplificada que evita problemas de tipado
  return (
    <div className="relative inline-flex group">
    <div className="opacity-50 cursor-not-allowed" aria-disabled="true">
      {/* Este div envuelve el contenido, no bloquea el hover */}
      {children}
    </div>
    {/* Capa invisible para detectar hover */}
    <div className="absolute inset-0 z-10"></div>

    {/* Tooltip que aparece al hacer hover */}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-red-100 text-red-800 border border-red-200 p-2 rounded shadow-lg w-64 text-center z-20">
      <p>Lo sentimos, pero una vez confirmado el pedido ya no se puede modificar o eliminar</p>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-red-100"></div>
    </div>
  </div>
  )
}
