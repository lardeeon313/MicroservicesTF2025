import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { createDeliveryZoneSchema } from '../../validations/DeliveryTeamSchemas';
import { X } from 'lucide-react';
import { CreateDeliveryZoneRequest } from '../../types/DeliveryTeamTypes';
import toast from 'react-hot-toast';
import { useDeliveryTeams } from '../../hooks/useDeliveryTeams';

interface CreateZoneDialogProps {
    isOpen: boolean;
    onClose: (success?: boolean) => void;
}

interface CreateZoneFormData {
    zoneName: string;
    zoneDescription: string;
}

export const CreateZoneDialog = ({ isOpen, onClose }: CreateZoneDialogProps) => {
    const { createNewZone } = useDeliveryTeams();

    const initialValues: CreateZoneFormData = {
        zoneName: '',
        zoneDescription: ''
    };

    const handleSubmit = async (values: CreateZoneFormData) => {
        try {
            const createRequest: CreateDeliveryZoneRequest = {
                zoneName: values.zoneName,
                zoneDescription: values.zoneDescription || undefined
            };
            await createNewZone(createRequest);
            toast.success('Zona creada exitosamente');
            onClose(true);
        } catch (error) {
            toast.error('Error al crear la zona');
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
                                        Crear Nueva Zona
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
                                    validationSchema={createDeliveryZoneSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting }) => (
                                        <Form className="space-y-4">
                                            <div>
                                                <label htmlFor="zoneName" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre de la Zona *
                                                </label>
                                                <Field
                                                    type="text"
                                                    id="zoneName"
                                                    name="zoneName"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingresa el nombre de la zona"
                                                />
                                                <ErrorMessage name="zoneName" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>

                                            <div>
                                                <label htmlFor="zoneDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Descripción
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    id="zoneDescription"
                                                    name="zoneDescription"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingresa una descripción de la zona (opcional)"
                                                />
                                                <ErrorMessage name="zoneDescription" component="div" className="text-red-500 text-sm mt-1" />
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
                                                    {isSubmitting ? 'Creando...' : 'Crear Zona'}
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
