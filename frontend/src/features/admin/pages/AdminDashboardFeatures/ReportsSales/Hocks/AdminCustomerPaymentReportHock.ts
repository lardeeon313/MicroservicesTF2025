import { useEffect, useState } from "react";
import API from "../../../../../../api/axios";
import {
  AdminCustomerReportFilters,
  AdminCustomerReportRow,
  AdminSalespaymentTypeReportMapper,
} from "../Types/CustomerPaymentType";

const PAGE_SIZE = 10;

export const useAdminCustomerReport = (
  filters: AdminCustomerReportFilters
) => {
  const [data, setData] = useState<AdminCustomerReportRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const response = await API.post(
          "/sales/SalesReport/report-customer-paymenttypes",
          {
            name: filters.name || null,
            paymentTypes: filters.paymentType.length
              ? filters.paymentType.map(
                  (pt) =>
                    Object.keys(
                      AdminSalespaymentTypeReportMapper
                    ).find(
                      (k) =>
                        AdminSalespaymentTypeReportMapper[k] ===
                        pt
                    ) ?? pt
                )
              : null,
            from: filters.startDate || null,
            to: filters.endDate || null,
            page,
            pageSize: PAGE_SIZE,
          }
        );

        const { items, totalCount } = response.data;

        const rows: AdminCustomerReportRow[] = items.map(
          (item: any, index: number) => ({
            customerId: item.customerId,
            nroCustomer: `#${(page - 1) * PAGE_SIZE + index + 1}`,
            fullName: item.customer,
            address: item.address,
            paymentTypes: item.paymentTypes.map((pt: string) => {
              const key = pt.toLowerCase();
              return (
                AdminSalespaymentTypeReportMapper[key] ?? pt
              );
            }),
          })
        );

        setData(rows);
        setTotalPages(Math.ceil(totalCount / PAGE_SIZE));
      } catch (error) {
        console.error(
          "Error loading customer payment type report",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters, page]);

  return {
    data,
    loading,
    page,
    totalPages,
    setPage,
  };
};
