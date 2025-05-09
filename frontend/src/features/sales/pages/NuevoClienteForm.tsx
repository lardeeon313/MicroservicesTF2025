"use client"

import React from "react"
import { useFormik } from "formik"
import { clienteValidationSchema } from "../validations/NewCustomerValidation"
import Header from "../components/Header"
import NewOrderForm from "../components/NewOrderForm"

const NuevoClienteForm: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      nombre: "",
      telefono: "",
      correo: "",
      direccion: "",
    },
    validationSchema: clienteValidationSchema,
    onSubmit: (values) => {
      alert("Formulario enviado correctamente:\n" + JSON.stringify(values, null, 2))
      // Acá podés hacer la llamada a la API para guardar el cliente
    },
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <h2 className="text-xl font-semibold mb-4">Crear Pedido para Nuevo Cliente</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <button className="bg-gray-200 text-center py-2 rounded">
          Cliente Existente
        </button>
        <button className="bg-gray-300 text-center py-2 rounded">
          Nuevo Cliente
        </button>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-4 rounded-md shadow-md mb-6 space-y-4"
      >
        {/* NOMBRE */}
        <div className="flex flex-col">
          <div className="flex items-center bg-white rounded border border-gray-300 p-2">
            <span className="mr-2">👤</span>
            <input
              type="text"
              name="nombre"
              placeholder="Ingresar Nombre del cliente"
              className="w-full border-0 focus:outline-none"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.nombre && formik.errors.nombre && (
            <div className="text-red-600 text-sm">{formik.errors.nombre}</div>
          )}
        </div>

        {/* TELEFONO */}
        <div className="flex flex-col">
          <div className="flex items-center bg-white rounded border border-gray-300 p-2">
            <span className="mr-2">📞</span>
            <input
              type="text"
              name="telefono"
              placeholder="Ingresar Teléfono"
              className="w-full border-0 focus:outline-none"
              value={formik.values.telefono}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.telefono && formik.errors.telefono && (
            <div className="text-red-600 text-sm">{formik.errors.telefono}</div>
          )}
        </div>

        {/* CORREO */}
        <div className="flex flex-col">
          <div className="flex items-center bg-white rounded border border-gray-300 p-2">
            <span className="mr-2">✉️</span>
            <input
              type="email"
              name="correo"
              placeholder="Ingresar Correo electrónico"
              className="w-full border-0 focus:outline-none"
              value={formik.values.correo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.correo && formik.errors.correo && (
            <div className="text-red-600 text-sm">{formik.errors.correo}</div>
          )}
        </div>

        {/* DIRECCIÓN */}
        <div className="flex flex-col">
          <div className="flex items-center bg-white rounded border border-gray-300 p-2">
            <span className="mr-2">🏠</span>
            <input
              type="text"
              name="direccion"
              placeholder="Ingresar Dirección"
              className="w-full border-0 focus:outline-none"
              value={formik.values.direccion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.direccion && formik.errors.direccion && (
            <div className="text-red-600 text-sm">{formik.errors.direccion}</div>
          )}
        </div>

        {/* BOTONES */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button type="submit" className="bg-green-800 text-white py-2 rounded">
            Crear Nota de pedido
          </button>
          <button type="submit" className="bg-green-800 text-white py-2 rounded">
            Registrar nuevo cliente
          </button>
        </div>
      </form>

      <div className="bg-white p-4 rounded-md shadow-md">
        <NewOrderForm />
      </div>
    </div>
  )
}

export default NuevoClienteForm
