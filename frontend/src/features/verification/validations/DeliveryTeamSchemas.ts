import * as yup from 'yup';

export const createDeliveryTeamSchema = yup.object({
  teamName: yup
    .string()
    .required('TeamName is required')
    .max(100, 'TeamName must be at most 100 characters'),
  teamDescription: yup
    .string()
    .max(500, 'TeamDescription must be at most 500 characters')
    .optional(),
});

export const updateDeliveryTeamSchema = yup.object({
  teamName: yup
    .string()
    .required('TeamName is required')
    .max(50, 'TeamName must be at most 50 characters'),
  teamDescription: yup
    .string()
    .max(500, 'TeamDescription must be at most 500 characters')
    .optional(),
});

export const createDeliveryZoneSchema = yup.object({
  zoneName: yup
    .string()
    .required('ZoneName is required')
    .max(100, 'ZoneName must be at most 100 characters'),
  zoneDescription: yup
    .string()
    .max(500, 'ZoneDescription must be at most 500 characters')
    .optional(),
});

export const updateDeliveryZoneSchema = yup.object({
  zoneName: yup
    .string()
    .required('ZoneName is required')
    .max(50, 'ZoneName must be at most 50 characters'),
  zoneDescription: yup
    .string()
    .max(500, 'ZoneDescription must be at most 500 characters')
    .optional(),
});





