import * as yup from 'yup';

export const createTeamSchema = yup.object({
    teamName: yup
        .string()
        .required('El nombre del equipo es requerido')
        .max(50, 'El nombre del equipo no puede contener mas de 50 carácteres'),
    teamDescription: yup
        .string()
        .max(500, 'La descripcion del equipo no puede contener mas de 500 carácteres')
});

export const updateTeamSchema = yup.object({
    teamId: yup
        .number()
        .required('Id is required'),
    teamName: yup 
        .string()
        .required('El nombre del equipo es requerido')
        .max(50, 'El nombre del equipo no puede contener mas de 50 carácteres'),
    teamDescription: yup
        .string()
        .max(500, 'La descripcion del equipo no puede contener mas de 500 carácteres')
});

export type CreateTeamFormData = yup.InferType<typeof createTeamSchema>;
export type UpdateTeamFormData = yup.InferType<typeof updateTeamSchema>;

















