import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, User, Mail } from 'lucide-react';
import { OperatorInTeam } from '../types/OperatorTypes';

interface TeamOperatorsListProps {
    isOpen: boolean;
    onClose: () => void;
    teamName: string;
    operators: OperatorInTeam[];
    onRemoveOperator: (operator: OperatorInTeam) => void;
}

export const TeamOperatorsList = ({ isOpen, onClose, teamName, operators, onRemoveOperator }: TeamOperatorsListProps) => {
    const [selectedOperator, setSelectedOperator] = useState<OperatorInTeam | null>(null);

    useEffect(() => {
        console.log('TeamOperatorsList: operators prop updated:', operators);
    }, [operators]);

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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Operadores del Equipo: {teamName}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Lista de Operadores */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3">Lista de Operadores</h4>
                                        {operators.length === 0 ? (
                                            <div className="text-center py-4 text-gray-500">
                                                No hay operadores asignados
                                            </div>
                                        ) : (
                                            operators.map((operator) => (
                                                <div
                                                    key={operator.operatorByUserId}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                                        selectedOperator?.operatorByUserId === operator.operatorByUserId
                                                            ? 'border-red-500 bg-red-50'
                                                            : 'border-gray-200 hover:border-red-300'
                                                    }`}
                                                    onClick={() => setSelectedOperator(operator)}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                                                <User className="h-5 w-5 text-red-600" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {operator.operatorName} {operator.operatorLastName}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {operator.operatorEmail}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                {operator.roleInTeam}
                                                            </span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onRemoveOperator(operator);
                                                                }}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                Remover
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Detalles del Operador */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-4">Detalles del Operador</h4>
                                        {selectedOperator ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                                                            <User className="h-8 w-8 text-red-600" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-lg font-medium text-gray-900">
                                                            {selectedOperator.operatorName} {selectedOperator.operatorLastName}
                                                        </h5>
                                                        <p className="text-sm text-gray-500">{selectedOperator.roleInTeam}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                        <span>{selectedOperator.operatorEmail}</span>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-gray-200">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Fecha de Asignación:</span>
                                                        <span className="text-gray-900">
                                                            {new Date(selectedOperator.assignAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                Selecciona un operador para ver sus detalles
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}; 