import React, { useState, useEffect } from 'react';
import { Button } from '../../../../components/Button';
import Dropdown from '../../../../components/Dropdown';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { getAllZones } from '../../services/DeliveryTeamService';
import { assignZoneToTeam } from '../../services/DeliveryTeamService';
import { DeliveryZoneDto } from '../../types/DeliveryTeamTypes';

interface AssignZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
  teamName: string;
  onSuccess: () => void;
}

export const AssignZoneModal: React.FC<AssignZoneModalProps> = ({
  isOpen,
  onClose,
  teamId,
  teamName,
  onSuccess
}) => {
  const [zones, setZones] = useState<DeliveryZoneDto[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadZones();
    }
  }, [isOpen]);

  const loadZones = async () => {
    setLoading(true);
    try {
      const data = await getAllZones();
      setZones(data);
    } catch (error) {
      console.error('Error al cargar zonas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedZoneId) {
      return;
    }

    setSubmitting(true);
    try {
      await assignZoneToTeam(teamId, {
        teamId,
        zoneId: selectedZoneId
      });
      
      onSuccess();
      onClose();
      setSelectedZoneId(null);
    } catch (error) {
      console.error('Error al asignar zona:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedZoneId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          Asignar Zona al Equipo: {teamName}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Zona
            </label>
            {loading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : (
              <Dropdown
                selected={selectedZoneId?.toString() || ''}
                onChange={(value) => setSelectedZoneId(parseInt(value))}
                options={zones.map(zone => ({
                  value: zone.id.toString(),
                  label: zone.name
                }))}
                placeholder="Seleccionar zona..."
              />
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!selectedZoneId || submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Asignando...' : 'Asignar Zona'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
