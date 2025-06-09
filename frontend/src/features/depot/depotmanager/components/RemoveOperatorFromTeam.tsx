import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useOperators } from '../hooks/useOperators';
import { useTeams } from '../hooks/useTeams';
import { X } from 'lucide-react';
import { OperatorInTeam } from '../types/OperatorTypes';

interface RemoveOperatorFromTeamProps {
    isOpen: boolean;
    onClose: () => void;
    operator: OperatorInTeam;
    teamId: number;
}

export const RemoveOperatorFromTeam = ({ isOpen, onClose, operator, teamId }: RemoveOperatorFromTeamProps) => {
    const { removeOperator } = useOperators();
    const { refetch } = useTeams();

    const handleRemove = async () => {
        try {
            await removeOperator(operator.operatorByUserId, teamId.toString());
            await refetch();
            onClose();
        } catch (error) {
            // Error is handled by the hook
        }
    };

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
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Remover Operador
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        ¿Estás seguro que deseas remover al operador "{operator.operatorByUserId}" del equipo? Esta acción no se puede deshacer.
                                    </p>
                                </div>

                                <div className="mt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
