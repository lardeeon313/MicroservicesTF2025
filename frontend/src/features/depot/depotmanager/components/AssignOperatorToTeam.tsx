import { Formik, Form } from 'formik';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { assignOperatorSchema, AssignOperatorFormData } from '../validations/operatorSchemas';
import { useOperators } from '../hooks/useOperators';
import { useTeams } from '../hooks/useTeams';
import { X, Search, User } from 'lucide-react';
import { DepotTeam } from '../types/DepotTeamTypes';
import { OperatorDto } from '../types/OperatorTypes';
import { Combobox } from '@headlessui/react';
import toast from 'react-hot-toast';

interface AssignOperatorToTeamProps {
    isOpen: boolean;
    onClose: () => void;
    team: DepotTeam;
}

export const AssignOperatorToTeam = ({ isOpen, onClose, team }: AssignOperatorToTeamProps) => {
    const { assignOperator, operators, fetchOperators, loading: loadingOperators, error } = useOperators();
    const { refetch } = useTeams();
    const [query, setQuery] = useState('');
    const [selectedOperator, setSelectedOperator] = useState<OperatorDto | null>(null);
    const [previewOperator, setPreviewOperator] = useState<OperatorDto | null>(null);

    useEffect(() => {
        if (isOpen) {
            console.log('Fetching operators...');
            fetchOperators();
        }
    }, [isOpen, fetchOperators]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const filteredOperators = query === ''
        ? operators
        : operators.filter((operator) =>
            `${operator.fullName} ${operator.email || ''}`
                .toLowerCase()
                .includes(query.toLowerCase())
        );

    const handleOperatorClick = (operator: OperatorDto) => {
        setPreviewOperator(operator);
    };

    const handleOperatorSelect = (operator: OperatorDto, setFieldValue: (field: string, value: any) => void) => {
        setSelectedOperator(operator);
        setPreviewOperator(null);
        setFieldValue('operatorUserId', operator?.id || '');
    };

    const handleSubmit = async (values: AssignOperatorFormData) => {
        try {
            await assignOperator(values);
            toast.success('Operador asignado exitosamente');
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
                                        Asignar Operador
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <Formik
                                    initialValues={{ teamId: team.id, operatorUserId: '' }}
                                    validationSchema={assignOperatorSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ setFieldValue }) => (
                                        <Form className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Buscar Operador
                                                </label>
                                                <Combobox
                                                    value={selectedOperator}
                                                    onChange={(operator) => operator && handleOperatorSelect(operator, setFieldValue)}
                                                >
                                                    <div className="relative">
                                                        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500">
                                                            <Combobox.Input
                                                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                                                displayValue={(operator: OperatorDto) =>
                                                                    operator ? operator.fullName : ''
                                                                }
                                                                onChange={(event) => setQuery(event.target.value)}
                                                                placeholder="Buscar por nombre o email..."
                                                            />
                                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <Search className="h-5 w-5 text-gray-400" />
                                                            </Combobox.Button>
                                                        </div>
                                                        <Transition
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                            afterLeave={() => setQuery('')}
                                                        >
                                                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                {loadingOperators ? (
                                                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                                                        Cargando...
                                                                    </div>
                                                                ) : filteredOperators.length === 0 ? (
                                                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                                                        No se encontraron operadores.
                                                                    </div>
                                                                ) : (
                                                                    filteredOperators.map((operator) => (
                                                                        <Combobox.Option
                                                                            key={operator.id}
                                                                            className={({ active }) =>
                                                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                                    active ? 'bg-red-600 text-white' : 'text-gray-900'
                                                                                }`
                                                                            }
                                                                            value={operator}
                                                                        >
                                                                            {({ selected, active }) => (
                                                                                <>
                                                                                    <span 
                                                                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'} cursor-pointer`}
                                                                                        onClick={() => handleOperatorClick(operator)}
                                                                                    >
                                                                                        {operator.fullName}
                                                                                    </span>
                                                                                    {operator.email && (
                                                                                        <span className={`block truncate text-sm ${active ? 'text-white' : 'text-gray-500'}`}>
                                                                                            {operator.email}
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </Combobox.Option>
                                                                    ))
                                                                )}
                                                            </Combobox.Options>
                                                        </Transition>
                                                    </div>
                                                </Combobox>
                                            </div>

                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Detalles del Operador</h4>
                                                <div className="space-y-2">
                                                    {(selectedOperator || previewOperator) ? (
                                                        <>
                                                            <div className="flex items-center text-sm text-gray-600">
                                                                <User className="h-4 w-4 mr-2" />
                                                                <span>{(selectedOperator || previewOperator)?.fullName}</span>
                                                            </div>
                                                            {(selectedOperator || previewOperator)?.email && (
                                                                <div className="text-sm text-gray-600">
                                                                    <span className="font-medium">Email:</span> {(selectedOperator || previewOperator)?.email}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="text-center py-4 text-gray-500">
                                                            Selecciona un operador para ver sus detalles
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-6 flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    onClick={onClose}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={!selectedOperator}
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Asignar
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
