import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDeliveryTeams } from '../../hooks/useDeliveryTeams';
import { X, AlertTriangle } from 'lucide-react';
import { DeliveryZoneDto } from '../../types/DeliveryTeamTypes';
import toast from 'react-hot-toast';

interface DeleteZoneDialogProps {
    isOpen: boolean;
    onClose: (success?: boolean) => void;
    zone: DeliveryZoneDto | null;
}

export const DeleteZoneDialog = ({ isOpen, onClose, zone }: DeleteZoneDialogProps) => {
    const { removeZone } = useDeliveryTeams();

    const handleDelete = async () => {
        if (!zone) return;

        try {
            await removeZone(zone.id);
            toast.success('Zona eliminada exitosamente');
            onClose(true);
        } catch (error) {
            toast.error('Error al eliminar la zona');
            onClose(false);
        }
    };

    if (!zone) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => onClose(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 backdrop-blur-sm bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Eliminar Zona
                                    </Dialog.Title>
                                    <button
                                        onClick={() => onClose(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="flex-shrink-0">
                                        <AlertTriangle className="h-8 w-8 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            ¿Estás seguro de que deseas eliminar la zona{' '}
                                            <span className="font-semibold text-gray-900">"{zone.name}"</span>?
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Esta acción no se puede deshacer.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => onClose(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
