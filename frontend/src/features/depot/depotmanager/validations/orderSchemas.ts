import * as yup from 'yup';

export const assignOrderSchema = yup.object().shape({
  DepotOrderId: yup.number().required('La orden de depósito es obligatoria.'),
  OperatorUserId: yup.string().required('El operador es obligatorio.'),
});

export const orderMissingReportedSchema = yup.object().shape({
  MissingReason: yup
    .string()
    .required('MissingReason is required')
    .max(100, 'The reason must be at most 100 characters long.'),
  MissingDescription: yup
    .string()
    .required('MissingDescription is required')
    .max(500, 'The description must be at most 500 characters long.'),
  DepotOrderId: yup.number().required('DepotOrderId is required.'),
  MissingItems: yup
    .array()
    .of(yup.object())
    .min(1, 'At least one missing item must be reported.')
    .required('MissingItems is required.'),
});