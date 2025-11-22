import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";
import { OperatorProductivityReport } from "../../../../types/Report";
import { OperatorProductivityFilterEntity } from "../../../../types/FilterReports/FilterReportsEntity";

export const useOperatorProductivityReport = (filters: OperatorProductivityFilterEntity) => {
  const [data, setData] = useState<OperatorProductivityReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await API.get("/logistic/LogisticReport/operator-productivity", {
          params: filters,
        });

      
        setData(data);
      } catch (err: any) {
        
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };


    fetchData();
  }, [filters]);

  return { data, isLoading, error };
};
