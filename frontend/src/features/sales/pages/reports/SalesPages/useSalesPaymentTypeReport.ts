// hooks/useCustomerReport.ts
import { useEffect, useState, useMemo } from "react";

import { getAllCustomers } from "../../../services/CustomerService";
import { getCustomerPaymentTypes } from "../../../services/OrderService";

// Types
export interface CustomerReportRow {
  customerId: string;
  nroCustomer: string;
  fullName: string;
  paymentTypes: string[];
  address: string;
}

export interface CustomerReportFilters {
  name: string;
  startDate?: string;
  endDate?: string;
  paymentType: string;
}

export const paymentTypeReportMapper: Record<string, string> = {
  transfer: "Transferencia",
  credit_Card: "Tarjeta de crédito",
  debit_Card: "Tarjeta de débito",
  cash: "Efectivo",
  current_Account: "Cuenta corriente",
  check: "Cheque",
  promissory_Note: "Pagaré",
};

export const useCustomerReport = (filters: CustomerReportFilters) => {
  const [data, setData] = useState<CustomerReportRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const customers = await getAllCustomers();

        const report: CustomerReportRow[] = await Promise.all(
          customers.map(async (c, index) => {
            // Tomar el primer address
            const firstAddress = c.addresses?.[0];

            const formattedAddress = firstAddress
              ? `${firstAddress.street} ${firstAddress.number}, ${firstAddress.city}`
              : "Sin dirección";

            const payments = await getCustomerPaymentTypes(c.id);

            return {
              customerId: c.id,
              nroCustomer: (index + 1).toString(), // Generado automáticamente
              fullName: `${c.firstName} ${c.lastName}`,
              address: formattedAddress,
              paymentTypes: payments.map((p) => paymentTypeReportMapper[p.paymentType] || p.paymentType),
            };
          })
        );

        setData(report);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Aplicar filtros
  const filtered = useMemo(() => {
    return data.filter((row) => {
      const matchName =
        filters.name === "" ||
        row.fullName.toLowerCase().includes(filters.name.toLowerCase());

      const matchPayment =
        filters.paymentType === "" ||
        row.paymentTypes.includes(filters.paymentType);

      // Filtrado por fechas → aún no tenés fecha en la respuesta, queda libre
      const matchDate = true;

      return matchName && matchPayment && matchDate;
    });
  }, [data, filters]);

  return { data: filtered, loading };
};
