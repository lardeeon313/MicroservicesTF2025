import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { updateTeamSchema, UpdateTeamFormData } from '../validations/DepotTeamSchemas';
import { useTeams } from '../hooks/useTeams';
import { X } from 'lucide-react';
import { DepotTeam, UpdateTeamRequest } from '../types/DepotTeamTypes';
import toast from 'react-hot-toast';

interface UpdateTeamDialogProps {
    isOpen: boolean;
    onClose: (success?: boolean) => void;
    team: DepotTeam;
}

export const UpdateTeamDialog = ({ isOpen, onClose, team }: UpdateTeamDialogProps) => {
    const { updateExistingTeam } = useTeams();

    const initialValues: UpdateTeamFormData = {
        teamId: team.id,
        teamName: team.teamName,
        teamDescription: team.teamDescription || ''
    };

    const handleSubmit = async (values: UpdateTeamFormData) => {
        try {
            const updateRequest: UpdateTeamRequest = {
                teamId: team.id,
                teamName: values.teamName,
                teamDescription: values.teamDescription || ''
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
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Actualizar Equipo
                                    </Dialog.Title>
                                    <button
                                        onClick={() => onClose(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={updateTeamSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize
                                >
                                    {({ isSubmitting }) => (
                                        <Form className="space-y-4">
                                            <div>
                                                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                                                    Nombre del Equipo
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="teamName"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                                />
                                                <ErrorMessage
                                                    name="teamName"
                                                    component="div"
                                                    className="mt-1 text-sm text-red-600"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-700">
                                                    Descripción
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    name="teamDescription"
                                                    rows={3}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                                />
                                                <ErrorMessage
                                                    name="teamDescription"
                                                    component="div"
                                                    className="mt-1 text-sm text-red-600"
                                                />
                                            </div>

                                            <div className="mt-4 flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => onClose(false)}
                                                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
