import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CrearPedido from "./features/sales/pages/CrearPedido";
import NuevoClienteForm from "./features/sales/pages/NuevoClienteForm";
import SalesDashboard from "./features/sales/pages/SalesDashboard";
import { OrderDetailsPage } from "./features/sales/pages/OrderDetailsPage";
import OrderManagment from "./features/sales/pages/OrderManagment";
import SendToDepositPage from "./features/sales/pages/SentToDepositPage";
import { OrderFullList } from "./features/sales/pages/OrderFullList";
import OrderDetailsForm from "./features/sales/components/OrderDetailsForm";
import { UpdateOrderWrapper } from "./features/sales/pages/update/UpdateOrderWrapper";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen p-6">
        <Routes>
          <Route path="/" element={<SalesDashboard />} />
          <Route path="/cliente-existente" element={<CrearPedido />} />
          <Route path="/nuevo-cliente" element={<NuevoClienteForm />} />
          <Route path="/sales/detalle/:id" element={<OrderDetailsPage />} />
          <Route path="/sales/listado" element={<OrderManagment />} />
          <Route path="/sales/enviar-deposito" element={<SendToDepositPage />} /> 
          <Route path="/sales/pedidos-completos" element={<OrderFullList/>} />
          <Route path="/detalle/:id" element={<OrderDetailsForm />} />
          <Route path="/sales/editar/:id" element={<UpdateOrderWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

