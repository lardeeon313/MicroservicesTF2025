import * as yup from 'yup';

export const assignOperatorSchema = yup.object({
    teamId: yup
        .number()
        .required('TeamId is required'),
    operatorUserId: yup
        .string()
        .required('OperatorId is required')
});

export type AssignOperatorFormData = yup.InferType<typeof assignOperatorSchema>;