// pages/InvoiceDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoicedOrderById } from "../services/OrderService";
import { useInvoiceExport } from "../hooks/useInvoiceExport";

type Invoice = {
  billingOrderId: number;
  customerName: string;
  totalAmount: number;
  date: string;
};
//NUEVA PAGINA: exportar un solo pedido facturado
const InvoiceOneDetailPage = () => {
  const { billingOrderId } = useParams<{ billingOrderId: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const { handleExport, loading: exporting } = useInvoiceExport();

  useEffect(() => {
  const fetchInvoice = async () => {
    if (!billingOrderId) {
      console.log("⚠️ No existe billingOrderId");
      return;
    }

    console.log("🔍 billingOrderId recibido:", billingOrderId);

    setLoading(true);
    try {
      const data = await getInvoicedOrderById(Number(billingOrderId));
      console.log("📦 Respuesta de getInvoicedOrderById:", data);

      setInvoice(data);
    } catch (err) {
      console.error("❌ Error en fetchInvoice:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchInvoice();
}, [billingOrderId]);


  if (loading) return <p>Cargando factura...</p>;
  if (!invoice) return <p>No se encontró el pedido en cuestion </p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Factura #{invoice.billingOrderId}
      </h1>
      <p><b>Cliente:</b> {invoice.customerName}</p>
      <p><b>Fecha:</b> {invoice.date}</p>
      <p><b>Monto:</b> ${invoice.totalAmount}</p>

      <div className="flex gap-4 mt-6">
        <button
          disabled={exporting}
          onClick={() => handleExport(invoice.billingOrderId, 0)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Exportar PDF
        </button>
        <button
          disabled={exporting}
          onClick={() => handleExport(invoice.billingOrderId, 1)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Exportar DOCX
        </button>
        <button
          disabled={exporting}
          onClick={() => handleExport(invoice.billingOrderId, 2)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Exportar XLSX
        </button>
      </div>
    </div>
  );
};

export default InvoiceOneDetailPage;
