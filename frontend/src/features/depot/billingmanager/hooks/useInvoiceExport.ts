// hooks/useInvoiceExport.ts
import { useState } from "react";
import { exportInvoice } from "../services/OrderService";

const getExtension = (type: number) => {
  switch (type) {
    case 0: return "pdf";
    case 1: return "docx";
    case 2: return "xlsx";
    default: return "bin";
  }
};

export const useInvoiceExport = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async (billingOrderId: number, type: number) => {
    try {
      setLoading(true);
      console.log("Intentando exportar factura con:", { billingOrderId, type });
      const blob = await exportInvoice(billingOrderId, type);
      const extension = getExtension(type);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `factura_${billingOrderId}.${extension}`;
      link.click();
      window.URL.revokeObjectURL(url);
    }catch (error) {
      console.error("Error en el hook al exportar:", error); // Log 2: Error en el hook
      alert("Error al exportar la factura. Verifica la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  return { handleExport, loading };
};
