import { EmployeeRole, EmployeeSector, EmployeeStatus } from '../types/Employee';

export const EmployeeRoleLabel: Record<EmployeeRole, string> = {
  [EmployeeRole.DepotManager]: 'Gerente de Depósito',
  [EmployeeRole.DepotOperator]: 'Operador de Depósito',
  [EmployeeRole.BillingManager]: 'Gerente de Facturación',
  [EmployeeRole.SalesStaff]: 'Personal de Ventas',
  [EmployeeRole.DeliveryOperator]: 'Operador de Entrega',
  [EmployeeRole.VerificationManager]: 'Gerente de Verificación',
  [EmployeeRole.Admin]: 'Administrador',
};

export const EmployeeSectorLabel: Record<EmployeeSector, string> = {
  [EmployeeSector.Administration]: 'Administración',
  [EmployeeSector.Sales]: 'Ventas',
  [EmployeeSector.Warehouse]: 'Depósito',
  [EmployeeSector.Delivery]: 'Entrega',
  [EmployeeSector.Verification]: 'Verificación',
  [EmployeeSector.Billing]: 'Facturación',
};

export const EmployeeStatusLabel: Record<EmployeeStatus, string> = {
  [EmployeeStatus.Active]: 'Activo',
  [EmployeeStatus.Inactive]: 'Inactivo',
  [EmployeeStatus.OnLicense]: 'En Licencia',
  [EmployeeStatus.Dismissed]: 'Despedido',
  [EmployeeStatus.ResignationProcess]: 'Proceso de Renuncia',
  [EmployeeStatus.Vacation]: 'Vacaciones',
};

export const getEmployeeRoleLabel = (role: EmployeeRole): string => {
  return EmployeeRoleLabel[role] || role;
};

export const getEmployeeSectorLabel = (sector: EmployeeSector): string => {
  return EmployeeSectorLabel[sector] || sector;
};

export const getEmployeeStatusLabel = (status: EmployeeStatus): string => {
  return EmployeeStatusLabel[status] || status;
};

