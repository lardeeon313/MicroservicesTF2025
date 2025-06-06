
import { useState, useEffect } from "react";
import { operatorService } from "../services/operatorService";

export function useOperator(operatorId: string) {
  const [operator, setOperator] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!operatorId) return;

    const fetchOperator = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await operatorService.getOperatorById(operatorId);
        setOperator(data);
      } catch {
        setError("Error cargando operador");
      } finally {
        setLoading(false);
      }
    };

    fetchOperator();
  }, [operatorId]);

  return { operator, loading, error };
}

