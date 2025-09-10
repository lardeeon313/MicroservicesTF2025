// pages/InvoiceDetailPage.tsx
import { useParams } from "react-router-dom";
import { useInvoiceExport } from "../hooks/useInvoiceExport";

const InvoiceDetailPage = () => {
  const { billingOrderId } = useParams<{ billingOrderId: string }>();
  const { handleExport, loading } = useInvoiceExport();

  if (!billingOrderId) return <p>Factura no encontrada</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Detalle de Factura #{billingOrderId}
      </h1>

      {/* Acá podés agregar más detalle del pedido facturado si lo necesitás */}

      <div className="flex gap-4 mt-4">
        <button
          disabled={loading}
          onClick={() => handleExport(Number(billingOrderId), 0)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Exportar PDF
        </button>
        <button
          disabled={loading}
          onClick={() => handleExport(Number(billingOrderId), 1)}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Exportar DOCX
        </button>
        <button
          disabled={loading}
          onClick={() => handleExport(Number(billingOrderId), 2)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Exportar XLSX
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
