interface BillingItem {
  id: number;
  productName: string;
  productBrand: string;
  quantity: number;
}

interface PriceData {
  unitPrice: number;
}

interface Props {
  items: BillingItem[];
  prices: PriceData[];
  onPriceChange: (index: number, value: number) => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onFacture: () => void;
  saving: boolean;
  facturing: boolean;
  hasSavedPrices: boolean;
  saveError?: string | null;
  saveSuccess?: boolean;
  factureError?: string | null;
  factureSuccess?: boolean;
}

export default function BillingOrderTable({
  items,
  prices,
  onPriceChange,
  onSave,
  onFacture,
  saving,
  facturing,
  hasSavedPrices,
  saveError,
  saveSuccess,
  factureError,
  factureSuccess,
}: Props) {
  return (
    <form onSubmit={onSave} className="space-y-8">
      {/* Tabla de productos */}
      <div className="overflow-x-auto rounded-lg shadow border">
        <table className="table-fixed w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-1/4 text-left px-4 py-3 font-semibold text-gray-700">Producto</th>
              <th className="w-1/4 text-left px-4 py-3 font-semibold text-gray-700">Marca</th>
              <th className="w-1/6 text-left px-4 py-3 font-semibold text-gray-700">Cantidad</th>
              <th className="w-1/6 text-left px-4 py-3 font-semibold text-gray-700">Precio Unitario</th>
              <th className="w-1/6 text-left px-4 py-3 font-semibold text-gray-700">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors">
                <td className="px-4 py-3">{item.productName}</td>
                <td className="px-4 py-3">{item.productBrand}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0.01}
                    step={0.01}
                    value={prices[idx]?.unitPrice || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                      onPriceChange(idx, val);
                    }}
                    className="border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-300 
                      rounded-md px-2 py-1 w-28 text-right shadow-sm outline-none transition"
                    required
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {prices[idx]?.unitPrice > 0
                    ? `$${(prices[idx].unitPrice * item.quantity).toFixed(2)}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-end items-center gap-4 border-t pt-4">
        <span className="text-lg font-semibold text-gray-700">Total:</span>
        <span className="text-2xl font-bold text-green-700">
          {prices.every((p) => p.unitPrice > 0)
            ? `$${prices.reduce((acc, p, idx) => acc + p.unitPrice * (items[idx]?.quantity ?? 0), 0).toFixed(2)}`
            : "-"}
        </span>
      </div>

      {/* Mensajes de estado */}
      <div className="space-y-3">
        {!hasSavedPrices && (
          <div className="text-yellow-600 bg-yellow-100 px-4 py-2 rounded-md shadow-sm text-center">
            Recuerda guardar los precios antes de facturar.
          </div>
        )}
        {saveError && (
          <div className="text-red-600 bg-red-100 px-4 py-2 rounded-md shadow-sm text-center">{saveError}</div>
        )}
        {saveSuccess && (
          <div className="text-green-600 bg-green-100 px-4 py-2 rounded-md shadow-sm text-center">
            Precios guardados correctamente.
          </div>
        )}
        {factureError && (
          <div className="text-red-600 bg-red-100 px-4 py-2 rounded-md shadow-sm text-center">{factureError}</div>
        )}
        {factureSuccess && (
          <div className="text-green-600 bg-green-100 px-4 py-2 rounded-md shadow-sm text-center">
            Orden facturada correctamente.
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 pt-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-2 rounded-lg shadow-md 
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar precios"}
        </button>
        <button
          type="button"
          onClick={onFacture}
          className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-6 py-2 rounded-lg shadow-md 
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={facturing}
        >
          {facturing ? "Facturando..." : "Facturar"}
        </button>
      </div>
    </form>
  );
}
