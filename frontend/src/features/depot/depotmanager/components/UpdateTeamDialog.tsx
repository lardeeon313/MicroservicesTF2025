import React, { useState, useEffect } from "react";

interface EditDepotTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  teamName: string;
  teamDescription?: string;
  onSave: (id: number, name: string, description?: string) => void;
}

export const EditDepotTeamDialog: React.FC<EditDepotTeamDialogProps> = ({
  isOpen,
  onClose,
  teamId,
  teamName: initialName,
  teamDescription: initialDescription,
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription || "");

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription || "");
    }
  }, [isOpen, initialName, initialDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Team name is required");
      return;
    }
    onSave(teamId, name.trim(), description.trim() || undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Depot Team</h2>
        <label className="block mb-2">
          Team Name
          <input
            type="text"
            className="border w-full p-2 mt-1 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="block mb-4">
          Description (optional)
          <textarea
            className="border w-full p-2 mt-1 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
