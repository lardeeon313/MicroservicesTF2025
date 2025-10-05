import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { DeliveryOperatorsInTeamDto } from '../../types/OperatorTypes';
import { useOperators } from '../../hooks/useOperators';
import toast from 'react-hot-toast';

interface RemoveOperatorFromTeamProps {
    isOpen: boolean;
    onClose: () => void;
    operator: DeliveryOperatorsInTeamDto | null;
    teamId: number;
    onRefetch?: () => Promise<void>;
}

export const RemoveOperatorFromTeam = ({ isOpen, onClose, operator, teamId, onRefetch }: RemoveOperatorFromTeamProps) => {
    const { removeOperator } = useOperators();

    const handleRemove = async () => {
        if (!operator) return;

        try {
            await removeOperator({
                operatorUserId: operator.operatorByUserId,
                teamId
            });
            toast.success('Operador removido exitosamente');
            if (onRefetch) await onRefetch();
            onClose();
        } catch (error) {
            toast.error('Hubo un error al remover el operador');
        }
    };

    if (!operator) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                                        Remover Operador
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
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
                                            ¿Estás seguro que deseas remover al operador{' '}
                                            <span className="font-semibold text-gray-900">
                                                "{operator.firstName} {operator.lastName}"
                                            </span>{' '}
                                            del equipo?
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Esta acción no se puede deshacer.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Remover
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
