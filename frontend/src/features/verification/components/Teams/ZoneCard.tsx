import { DeliveryZoneDto } from '../../types/DeliveryTeamTypes';
import { Edit, Trash2, MapPin, Power, PowerOff } from 'lucide-react';

interface ZoneCardProps {
    zone: DeliveryZoneDto;
    onEdit: (zone: DeliveryZoneDto) => void;
    onDelete: (zone: DeliveryZoneDto) => void;
    onActivate?: (zoneId: number) => Promise<void>;
    onDeactivate?: (zoneId: number) => Promise<void>;
}

export const ZoneCard = ({ zone, onEdit, onDelete, onActivate, onDeactivate }: ZoneCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(zone)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Editar zona"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    {zone.isActive ? (
                        <button
                            onClick={() => onDeactivate?.(zone.id)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Desactivar zona"
                        >
                            <PowerOff className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => onActivate?.(zone.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Activar zona"
                        >
                            <Power className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(zone)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar zona"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {zone.description && (
                <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{zone.description}</p>
                </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Zona de Entrega</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    zone.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {zone.isActive ? 'Activa' : 'Inactiva'}
                </span>
            </div>
        </div>
    );
};
