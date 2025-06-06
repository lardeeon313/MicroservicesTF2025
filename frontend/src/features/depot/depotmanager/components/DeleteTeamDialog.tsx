import React from "react";

interface DeleteDepotTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  teamName: string;
  onDelete: (id: number) => void;
}

export const DeleteDepotTeamDialog: React.FC<DeleteDepotTeamDialogProps> = ({
  isOpen,
  onClose,
  teamId,
  teamName,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Delete Depot Team</h2>
        <p>
          Are you sure you want to delete the team <strong>{teamName}</strong>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => onDelete(teamId)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};