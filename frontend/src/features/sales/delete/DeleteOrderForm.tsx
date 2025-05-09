import React from "react";
import Swal from "sweetalert2";

//IMPLEMENTARLO:

interface DeleteOrderFormProps {
  handleEliminar: () => void;
}

const DeleteOrderForm: React.FC<DeleteOrderFormProps> = ({ handleEliminar }) => {
  const confirmarEliminacion = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        handleEliminar();
        Swal.fire('Eliminado', 'El pedido ha sido eliminado.', 'success');
      }
    });
  };

  return (
    <button
      onClick={confirmarEliminacion}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Eliminar Pedido
    </button>
  );
};

export default DeleteOrderForm;

