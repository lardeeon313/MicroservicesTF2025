import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { updateDeliveryTeamSchema } from '../../validations/DeliveryTeamSchemas';
import { useDeliveryTeams } from '../../hooks/useDeliveryTeams';
import { X } from 'lucide-react';
import { DeliveryTeamDto, UpdateDeliveryTeamRequest } from '../../types/DeliveryTeamTypes';
import toast from 'react-hot-toast';

interface UpdateTeamDialogProps {
    isOpen: boolean;
    onClose: (success?: boolean) => void;
    team: DeliveryTeamDto | null;
}

interface UpdateTeamFormData {
    teamName: string;
    teamDescription: string;
}

export const UpdateTeamDialog = ({ isOpen, onClose, team }: UpdateTeamDialogProps) => {
    const { updateExistingTeam } = useDeliveryTeams();

    if (!team) return null;

    const initialValues: UpdateTeamFormData = {
        teamName: team.teamName,
        teamDescription: team.teamDescription || ''
    };

    const handleSubmit = async (values: UpdateTeamFormData) => {
        try {
            const updateRequest: UpdateDeliveryTeamRequest = {
                id: team.id,
                teamName: values.teamName,
                teamDescription: values.teamDescription || undefined
            };
            await updateExistingTeam(team.id, updateRequest);
            toast.success('Equipo actualizado exitosamente');
            onClose(true);
        } catch (error) {
            toast.error('Error al actualizar el equipo');
            onClose(false);
        }
    };

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
                                        Actualizar Equipo
                                    </Dialog.Title>
                                    <button
                                        onClick={() => onClose(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={updateDeliveryTeamSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize
                                >
                                    {({ isSubmitting }) => (
                                        <Form className="space-y-4">
                                            <div>
                                                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre del Equipo *
                                                </label>
                                                <Field
                                                    type="text"
                                                    id="teamName"
                                                    name="teamName"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingresa el nombre del equipo"
                                                />
                                                <ErrorMessage name="teamName" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>

                                            <div>
                                                <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Descripción
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    id="teamDescription"
                                                    name="teamDescription"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingresa una descripción del equipo (opcional)"
                                                />
                                                <ErrorMessage name="teamDescription" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>

                                            <div className="flex justify-end space-x-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => onClose(false)}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? 'Actualizando...' : 'Actualizar Equipo'}
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
