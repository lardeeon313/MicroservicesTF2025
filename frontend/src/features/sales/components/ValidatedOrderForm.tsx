// src/features/sales/components/ValidatedOrderForm.tsx

import React, { useState, forwardRef, useImperativeHandle } from "react";
import Swal from "sweetalert2";

export type ValidatedOrderFormHandle = {
  submitForm: () => void;
};

type Props = {
  showCustomerFields?: boolean;
  showCustomerSearch?: boolean;
};

const ValidatedOrderForm = forwardRef<ValidatedOrderFormHandle, Props>(
  ({ showCustomerFields, showCustomerSearch }, ref) => {
    const [customer, setCustomer] = useState({
      nombre: "",
      apellido: "",
      telefono: "",
      correo: "",
      direccion: "",
    });

    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [products, setProducts] = useState([{ nombre: "", cantidad: 1 }]);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (
      index: number,
      field: string,
      value: string
    ) => {
      const updated = [...products];
      updated[index] = { ...updated[index], [field]: value };
      setProducts(updated);
    };

    const addProduct = () => {
      setProducts([...products, { nombre: "", cantidad: 1 }]);
    };

    const removeProduct = (index: number) => {
      const updated = [...products];
      updated.splice(index, 1);
      setProducts(updated);
    };

    const validateForm = () => {
      if (showCustomerFields) {
        const empty = Object.values(customer).some((val) => val.trim() === "");
        if (empty) return false;
      }

      if (showCustomerSearch && selectedCustomer.trim() === "") return false;

      return products.length > 0 && products.every((p) => p.nombre.trim() !== "");
    };

    const submitForm = () => {
      if (!validateForm()) {
        Swal.fire({
          icon: "error",
          title: "Faltan campos",
          text: "Por favor completa todos los campos antes de emitir el pedido.",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Pedido emitido",
        text: "El pedido se ha emitido correctamente.",
      });
    };

    useImperativeHandle(ref, () => ({
      submitForm,
    }));

    return (
      <div className="space-y-4">
        {showCustomerFields && (
          <div className="grid grid-cols-2 gap-4">
            <input
              name="nombre"
              placeholder="Nombre"
              value={customer.nombre}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="apellido"
              placeholder="Apellido"
              value={customer.apellido}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="telefono"
              placeholder="Teléfono"
              value={customer.telefono}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="correo"
              placeholder="Correo electrónico"
              value={customer.correo}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="direccion"
              placeholder="Dirección"
              value={customer.direccion}
              onChange={handleChange}
              className="p-2 border rounded col-span-2"
            />
          </div>
        )}

        {showCustomerSearch && (
          <div>
            <input
              placeholder="Buscar cliente..."
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Productos</h3>
          {products.map((product, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                placeholder="Nombre del producto"
                value={product.nombre}
                onChange={(e) =>
                  handleProductChange(index, "nombre", e.target.value)
                }
                className="p-2 border rounded flex-1"
              />
              <input
                type="number"
                min={1}
                value={product.cantidad}
                onChange={(e) =>
                  handleProductChange(index, "cantidad", e.target.value)
                }
                className="p-2 border rounded w-24"
              />
              <button
                onClick={() => removeProduct(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                -
              </button>
            </div>
          ))}
          <button
            onClick={addProduct}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            + Agregar producto
          </button>
        </div>
      </div>
    );
  }
);

export default ValidatedOrderForm;
