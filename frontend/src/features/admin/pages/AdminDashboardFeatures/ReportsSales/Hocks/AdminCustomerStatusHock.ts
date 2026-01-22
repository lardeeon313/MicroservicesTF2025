// hooks/useCustomerStatusReport.ts

import { useEffect, useState } from 'react';
import { CustomerStatusReportDto,GetCustomerStatusReportRequest,PagedResult } from '../Types/CustomerStatusReportType';
import API from '../../../../../../api/axios';

export const AdminUseCustomerStatusReport = (
  filters: GetCustomerStatusReportRequest
) => {
  const [data, setData] = useState<PagedResult<CustomerStatusReportDto>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.post<PagedResult<CustomerStatusReportDto>>(
        '/sales/SalesReport/reports-customer-status',
        filters  
      );

      setData(response.data);
    } catch (err) {
      setError('Error al obtener el reporte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [filters]);

  return {
    data,
    loading,
    error,
    refetch: fetchReport
  };
};
