import * as yup from 'yup';

// ========== ASSIGN OPERATOR SCHEMA ==========

export const assignOperatorSchema = yup.object({
  teamId: yup
    .number()
    .required('TeamId is required')
    .positive('TeamId must be a positive number'),
  operatorUserId: yup
    .string()
    .required('OperatorUserId is required')
    .min(1, 'OperatorUserId cannot be empty'),
  roleInTeam: yup
    .string()
    .required('RoleInTeam is required')
    .max(50, 'RoleInTeam must be at most 50 characters')
    .oneOf(['Leader', 'Member', 'Driver', 'Helper'], 'RoleInTeam must be one of: Leader, Member, Driver, Helper')
});

export interface AssignOperatorFormData {
  teamId: number;
  operatorUserId: string;
  roleInTeam: string;
}

// ========== REMOVE OPERATOR SCHEMA ==========

export const removeOperatorSchema = yup.object({
  operatorUserId: yup
    .string()
    .required('OperatorUserId is required')
    .min(1, 'OperatorUserId cannot be empty'),
  teamId: yup
    .number()
    .required('TeamId is required')
    .positive('TeamId must be a positive number')
});

export interface RemoveOperatorFormData {
  operatorUserId: string;
  teamId: number;
}

// ========== UPDATE ROLE SCHEMA ==========

export const updateRoleSchema = yup.object({
  operatorUserId: yup
    .string()
    .required('OperatorUserId is required')
    .min(1, 'OperatorUserId cannot be empty'),
  teamId: yup
    .number()
    .required('TeamId is required')
    .positive('TeamId must be a positive number'),
  newRole: yup
    .string()
    .required('NewRole is required')
    .max(50, 'NewRole must be at most 50 characters')
    .oneOf(['Leader', 'Member', 'Driver', 'Helper'], 'NewRole must be one of: Leader, Member, Driver, Helper')
});

export interface UpdateRoleFormData {
  operatorUserId: string;
  teamId: number;
  newRole: string;
}
