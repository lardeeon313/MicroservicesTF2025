import React, { useState } from "react";

interface AssignOperatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  onAssign: (teamId: number, operatorId: string) => void;
}

export const AssignOperatorDialog: React.FC<AssignOperatorDialogProps> = ({
  isOpen,
  onClose,
  teamId,
  onAssign,
}) => {
  const [operatorId, setOperatorId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorId.trim()) {
      alert("Operator ID is required");
      return;
    }
    onAssign(teamId, operatorId.trim());
    setOperatorId("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl font-semibold mb-4">Assign Operator to Team</h2>
        <label className="block mb-4">
          Operator User ID (GUID)
          <input
            type="text"
            className="border w-full p-2 mt-1 rounded"
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value)}
            required
          />
        </label>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setOperatorId("");
              onClose();
            }}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Assign
          </button>
        </div>
      </form>
    </div>
  );
};
export default AssignOperatorDialog;