import * as yup from 'yup';

export const getInvoicedOrdersByCustomerSchema = yup.object().shape({
  CustomerId: yup
    .string()
    .required('El ID del cliente es obligatorio.')
    .test('is-guid', 'El ID del cliente debe ser un GUID válido.', value =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value || '')
    ),
});

export const getInvoicedOrdersByDateRangeSchema = yup.object().shape({
  StartDate: yup
    .date()
    .required('La fecha de inicio es obligatoria.')
    .max(yup.ref('EndDate'), 'La fecha de inicio debe ser menor o igual a la fecha de fin.'),
  EndDate: yup
    .date()
    .required('La fecha de fin es obligatoria.')
    .min(yup.ref('StartDate'), 'La fecha de fin debe ser mayor o igual a la fecha de inicio.'),
});

export const setItemUnitPricesSchema = yup.object().shape({
  DepotOrderId: yup.number().moreThan(0, 'El ID de la orden debe ser mayor a 0.'),
  ItemUnitPrices: yup.array().of(
    yup.object().shape({
      ItemId: yup.number().moreThan(0, 'El ID del ítem debe ser mayor a 0.'),
      UnitPrice: yup.number().moreThan(0, 'El precio unitario debe ser mayor a 0.'),
    })
  ),
});

export const updateInvoicedItemPriceSchema = yup.object().shape({
  BillingOrderId: yup
    .number()
    .required('El ID de la orden facturada es obligatorio.')
    .moreThan(0, 'El ID de la orden facturada debe ser mayor a 0.'),
  NewUnitPrice: yup
    .number()
    .required('El nuevo precio unitario es obligatorio.')
    .moreThan(0, 'El nuevo precio unitario debe ser mayor a 0.'),
  ItemId: yup
    .number()
    .required('El ID del ítem es obligatorio.')
    .moreThan(0, 'El ID del ítem debe ser mayor a 0.'),
}); 