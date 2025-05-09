import Header from "../components/Header";
import SendToDepositCard from "../components/SendToDepositCard";
import { MockOrders } from "../data/MockOrders";

export const SendToDepositPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <section className="px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Envío de pedidos a depósito
        </h1>
        <div>
          {MockOrders.map((order) => {
                              const fixedOrder = {
                              ...order,
                              estado: order.estado as any  // forzamos el tipo
                              };
                                  return <SendToDepositCard key={order.id} order={fixedOrder} />;
                              })}
        </div>
      </section>
    </div>
  );
};

export default SendToDepositPage;
