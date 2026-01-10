export interface SalesPerfomanceReportType {
  salespersonName: string;
  totalOrders: number;
  totalUnitsSold: number;
  lastOrderDate: string | null;
}

export enum SalesRangeReport {
  All = "All",
  Quincena = "Quincena",
  Mensual = "Mensual",
  Trimestral = "Trimestral",
  Semestral = "Semestral",
  Anual = "Anual",
}
