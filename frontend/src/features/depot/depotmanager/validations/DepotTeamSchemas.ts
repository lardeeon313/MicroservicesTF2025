import * as yup from 'yup';

export const createTeamSchema = yup.object({
    teamName: yup
        .string()
        .required('TeamName is required')
        .max(100, 'TeamName must be at most 100 characters'),
    teamDescription: yup
        .string()
        .max(500, 'TeamDescription must be at most 500 characters')
});

export const updateTeamSchema = yup.object({
    teamId: yup
        .number()
        .required('Id is required'),
    teamName: yup
        .string()
        .required('TeamName is required')
        .max(50, 'TeamName must be at most 50 characters'),
    teamDescription: yup
        .string()
        .max(500, 'TeamDescription must be at most 500 characters')
});

export type CreateTeamFormData = yup.InferType<typeof createTeamSchema>;
export type UpdateTeamFormData = yup.InferType<typeof updateTeamSchema>;

















