import API from "../../../api/axios";
import {
  ChangeStatusEmployeeRequest,
  EmployeeDto,
  EmployeeRole,
  EmployeeSector,
  EmployeeStatus,
  RegisterEmployeeRequest,
  UpdateEmployeeRequest,
} from "../types/Employee";

// ===== Helpers =====

const ROLE_TO_NUMBER: Record<EmployeeRole, number> = {
  [EmployeeRole.DepotManager]: 0,
  [EmployeeRole.DepotOperator]: 1,
  [EmployeeRole.BillingManager]: 2,
  [EmployeeRole.SalesStaff]: 3,
  [EmployeeRole.DeliveryOperator]: 4,
  [EmployeeRole.VerificationManager]: 5,
  [EmployeeRole.Admin]: 6,
};

const SECTOR_TO_NUMBER: Record<EmployeeSector, number> = {
  [EmployeeSector.Administration]: 0,
  [EmployeeSector.Sales]: 1,
  [EmployeeSector.Warehouse]: 2,
  [EmployeeSector.Delivery]: 3,
  [EmployeeSector.Verification]: 4,
  [EmployeeSector.Billing]: 5,
};

const STATUS_TO_NUMBER: Record<EmployeeStatus, number> = {
  [EmployeeStatus.Active]: 0,
  [EmployeeStatus.Inactive]: 1,
  [EmployeeStatus.OnLicense]: 2,
  [EmployeeStatus.Dismissed]: 3,
  [EmployeeStatus.ResignationProcess]: 4,
  [EmployeeStatus.Vacation]: 5,
};

const NUMBER_TO_ROLE_MAP: Record<number, EmployeeRole> = {
  0: EmployeeRole.DepotManager,
  1: EmployeeRole.DepotOperator,
  2: EmployeeRole.BillingManager,
  3: EmployeeRole.SalesStaff,
  4: EmployeeRole.DeliveryOperator,
  5: EmployeeRole.VerificationManager,
  6: EmployeeRole.Admin,
};

const NUMBER_TO_SECTOR_MAP: Record<number, EmployeeSector> = {
  0: EmployeeSector.Administration,
  1: EmployeeSector.Sales,
  2: EmployeeSector.Warehouse,
  3: EmployeeSector.Delivery,
  4: EmployeeSector.Verification,
  5: EmployeeSector.Billing,
};

const NUMBER_TO_STATUS_MAP: Record<number, EmployeeStatus> = {
  0: EmployeeStatus.Active,
  1: EmployeeStatus.Inactive,
  2: EmployeeStatus.OnLicense,
  3: EmployeeStatus.Dismissed,
  4: EmployeeStatus.ResignationProcess,
  5: EmployeeStatus.Vacation,
};

const roleToNumber = (role: EmployeeRole): number => ROLE_TO_NUMBER[role];
const sectorToNumber = (sector: EmployeeSector): number => SECTOR_TO_NUMBER[sector];
const statusToNumber = (status: EmployeeStatus): number => STATUS_TO_NUMBER[status];

const numberToRole = (roleNumber: number): EmployeeRole => {
  const role = NUMBER_TO_ROLE_MAP[roleNumber];
  if (!role) {
    throw new Error(`Invalid role number: ${roleNumber}`);
  }
  return role;
};

const numberToSector = (sectorNumber: number): EmployeeSector => {
  const sector = NUMBER_TO_SECTOR_MAP[sectorNumber];
  if (!sector) {
    throw new Error(`Invalid sector number: ${sectorNumber}`);
  }
  return sector;
};

const numberToStatus = (statusNumber: number): EmployeeStatus => {
  const status = NUMBER_TO_STATUS_MAP[statusNumber];
  if (!status) {
    throw new Error(`Invalid status number: ${statusNumber}`);
  }
  return status;
};

const toBackendEmployeePayload = (
  data: RegisterEmployeeRequest | UpdateEmployeeRequest
) => ({
  userName: data.userName,
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  phoneNumber: data.phoneNumber,
  role: roleToNumber(data.role),
  status: statusToNumber(data.status),
  sector: sectorToNumber(data.sector),
  ...(("id" in data) && { id: data.id }),
});

const normalizeEmployeesPayload = (payload: any): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload?.data && Array.isArray(payload.data)) {
    return payload.data;
  }
  if (payload && typeof payload === "object") {
    return [payload];
  }
  return [];
};

const transformEmployeeFromBackend = (employee: any): EmployeeDto => {
  if (!employee || employee.id == null) {
    throw new Error("Employee must include an id");
  }

  return {
    id: employee.id,
    userName: employee.userName || employee.UserName || "",
    firstName: employee.firstName || employee.FirstName || "",
    lastName: employee.lastName || employee.LastName || "",
    phoneNumber: employee.phoneNumber || employee.PhoneNumber || "",
    email: employee.email || employee.Email || "",
    role:
      typeof employee.role === "number"
        ? numberToRole(employee.role)
        : (employee.role as EmployeeRole),
    sector:
      typeof employee.sector === "number"
        ? numberToSector(employee.sector)
        : (employee.sector as EmployeeSector),
    status:
      typeof employee.status === "number"
        ? numberToStatus(employee.status)
        : (employee.status as EmployeeStatus),
    createdAt: employee.createdAt || employee.CreatedAt,
  };
};

const mapEmployeesFromResponse = (payload: any): EmployeeDto[] => {
  return normalizeEmployeesPayload(payload)
    .filter((emp) => emp?.id != null)
    .map((emp) => transformEmployeeFromBackend(emp));
};

// ===== Commands =====

export const registerEmployee = async (
  data: RegisterEmployeeRequest
): Promise<void> => {
  await API.post("/admin/admin/create-employee", toBackendEmployeePayload(data));
};

export const updateEmployee = async (
  data: UpdateEmployeeRequest
): Promise<void> => {
  await API.post("/admin/admin/Update-employee", toBackendEmployeePayload(data));
};

export const changeEmployeeStatus = async (
  data: ChangeStatusEmployeeRequest
): Promise<void> => {
  await API.post("/admin/admin/change-status-employee", {
    Id: data.id,
    Status: statusToNumber(data.status),
  });
};

// ===== Queries =====

export const getAllEmployees = async (): Promise<EmployeeDto[]> => {
  const response = await API.get("/admin/admin/get-all-employees");
  return mapEmployeesFromResponse(response.data);
};

export const getEmployeeById = async (
  employeeId: number
): Promise<EmployeeDto> => {
  const response = await API.get("/admin/admin/get-employee-by-id", {
    params: { EmployeeId: employeeId },
  });
  return transformEmployeeFromBackend(response.data);
};

export const getEmployeesByStatus = async (
  status: EmployeeStatus
): Promise<EmployeeDto[]> => {
  const response = await API.get("/admin/admin/get-employees-by-status", {
    params: { status: statusToNumber(status) },
  });
  return mapEmployeesFromResponse(response.data);
};

export const getEmployeesBySector = async (
  sector: EmployeeSector
): Promise<EmployeeDto[]> => {
  const response = await API.get("/admin/admin/get-employees-by-sector", {
    params: { sector: sectorToNumber(sector) },
  });
  return mapEmployeesFromResponse(response.data);
};