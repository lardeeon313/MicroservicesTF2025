// hooks/useInvoiceExport.ts
import { useState } from "react";
import { exportInvoice } from "../services/OrderService";

const getExtension = (type: number) => {
  switch (type) {
    case 0: return "pdf";
    case 1: return "xlsx";
    case 2: return "docx";
    default: return "bin";
  }
};

export const useInvoiceExport = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async (billingOrderId: number, type: number) => {
    try {
      setLoading(true);      
      const blob = await exportInvoice(billingOrderId, type);
      const extension = getExtension(type);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `factura_${billingOrderId}.${extension}`;
      link.click();
      window.URL.revokeObjectURL(url);
    }catch (error) {      
      alert("Error al exportar la factura. Verifica la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  return { handleExport, loading };
};
