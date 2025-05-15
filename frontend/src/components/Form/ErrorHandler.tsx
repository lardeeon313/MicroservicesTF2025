// src/components/Form/ErrorHandler.tsx
import { toast } from "react-hot-toast";

interface HandleFormikErrorParams {
  error: unknown;
  customMessages?: Record<number, string>;
}

interface ApiError {
  data?: {
    status?: number;
  };
}

export const handleFormikError = ({ error, customMessages }: HandleFormikErrorParams) => {
  if (error && typeof error === "object" && "data" in error) {
    const status = (error as ApiError).data?.status;

    if (status != undefined && customMessages && customMessages[status]) {
      toast.error(customMessages[status]);
    } else {
      toast.error("Ocurrió un error inesperado.");
    }
  } else {
    toast.error("Error desconocido al procesar la solicitud.");
  }

  console.error(error);
};