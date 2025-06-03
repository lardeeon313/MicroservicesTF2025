import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  operatorId: string;
}

export const RemoveOperatorDialog: React.FC<Props> = ({ isOpen, onClose, onConfirm, operatorId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Confirmar Remoción</h2>
        <p className="mb-6">
          ¿Estás seguro que deseas remover al operador <strong>{operatorId}</strong> del equipo?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
};