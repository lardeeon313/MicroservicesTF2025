import * as yup from 'yup';

export const assignOperatorSchema = yup.object({
    teamId: yup
        .number()
        .required('TeamId is required'),
    operatorUserId: yup
        .string()
        .required('OperatorId is required')
});

export const assignOrderSchema = yup.object().shape({
  DepotOrderId: yup.number().required('La orden de depósito es obligatoria.'),
  OperatorUserId: yup.string().required('El opeador es obligatorio.'),
});

export type AssignOperatorFormData = yup.InferType<typeof assignOperatorSchema>;