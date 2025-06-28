import { useState } from "react";
import { AddPackanings } from "../services/PostAddPackings";
import type { AddPackingCommand } from "../types/AddPackings";

export function useAddPackagings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [success, setSuccess] = useState(false);

  const addPackagings = async (data: AddPackingCommand) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await AddPackanings(data);
      setSuccess(true);
    } catch (err) {
      setError(err as Error);
      
    } finally {
      setLoading(false);
    }
  };

  return { addPackagings, loading, error, success };
}