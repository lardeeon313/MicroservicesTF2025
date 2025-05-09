"use client"

import React, { useState } from "react"
import CustomerForm from "../components/CustomerForm"
import NewOrderForm from "../components/NewOrderForm"
import Header from "../components/Header"

interface Cliente {
  id: number
  nombre: string
  direccion: string
  icono?: string
}

const CrearPedido: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)

  const handleSelectClient = (cliente: Cliente) => {
    setSelectedClient(cliente)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header/>
      <h2 className="text-xl font-semibold mb-4">Crear Pedido para Cliente Existente</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button className="bg-gray-300 text-center py-2 rounded">
          Cliente Existente
        </button>
        <button className="bg-gray-200 text-center py-2 rounded">
          Nuevo Cliente
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-md shadow-md">
        <CustomerForm onSelectClient={handleSelectClient} />
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-md shadow-md">
        <NewOrderForm cliente={selectedClient || undefined} />
      </div>
    </div>
  )
}

export default CrearPedido