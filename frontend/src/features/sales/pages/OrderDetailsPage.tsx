import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MockOrders } from "../data/MockOrders";
import { OrderProps } from "../components/Order"; // Asegurate de que el path sea correcto
import Swal from "sweetalert2";
import Header from "../components/Header";
//no lo estoy utilizando debido a que tengo que instalar libreria y aparte sale un error gravisimo
//en pantalla 
import { BusinessRules } from "./BusinessRules/BusinessRules";
import { OrderStatus } from "../components/Order";

export const OrderDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<OrderProps | null>(null);
    const [edit, setEdit] = useState(false);
    const [cliente, setCliente] = useState("");
    const [estado, setEstado] = useState("");
    const [detalles, setDetalles] = useState("");
    const [comprobante, setComprobante] = useState<File | null>(null); // Para subir el comprobante
    const Navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setComprobante(file);

        if (file) {
            Swal.fire({
                icon: "success",
                title: "Comprobante cargado",
                text: `Se subió correctamente: ${file.name}`,
                confirmButtonColor: "#3085d6",
            });
        }
    };

    const IssueAlert = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción enviará una alerta por faltante",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, emitir alerta",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Alerta emitida", "Se notificó el faltante", "success");
            }
        });
    };

    useEffect(() => {
        if (!id) return;
        const encontrado = MockOrders.find((p) => p.id === id);
        if (encontrado) {
            setPedidoSeleccionado(encontrado);
            setCliente(encontrado.cliente);
            setEstado(encontrado.estado);
        }
    }, [id]);

    if (!pedidoSeleccionado) return <p>Cargando pedido...</p>;

    const {
        direccion,
        tipoLocal,
        productos,
        fechaPedido,
        fechaEntrega,
        comprobante_p,
        montoTotal,
        detalleDeEntrega
    } = pedidoSeleccionado;

    const handleActualizar = (pedido: OrderProps) => {
        setPedidoSeleccionado(pedido);
        setEdit(true);
    };

    const handleEliminar = () => {
        alert(`Pedido ${id} eliminado`);
    };

    return (
        <div className="p-4">
            <Header/>
            <h2 className="text-2xl font-bold mb-4">Gestión de pedidos</h2>

            <div className="bg-white rounded shadow p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Detalle del pedido</h3>

                <label className="block mb-2 text-sm font-semibold">Cliente</label>
                <input
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                />

                <label className="block mb-2 text-sm font-semibold">Estado</label>
                <input
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                />

                <label className="block mb-2 text-sm font-semibold">Detalles del pedido</label>
                <textarea
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                    placeholder="Agregar detalles"
                    value={detalles}
                    onChange={(e) => setDetalles(e.target.value)}
                />

                <div className="flex gap-4 mb-6">
                    {/**En caso de que el pedido este en "confirmado" inhabilita los dos botones */}
                    <BusinessRules estado={estado as OrderStatus} actionType="update">
                        <button
                            onClick={() => Navigate(`/sales/editar/${id}`)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                        >
                            Actualizar Pedido
                        </button>
                    </BusinessRules>
                    <BusinessRules estado={estado as OrderStatus} actionType="delete">
                        <button
                            onClick={handleEliminar}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                            Eliminar Pedido
                        </button> 
                    </BusinessRules>
                </div>

                <div className="mb-4">
                    <strong>Dirección:</strong> {direccion}
                </div>
                <div className="mb-4">
                    <strong>Tipo de local:</strong> {tipoLocal}
                </div>
                <div className="mb-4">
                    <strong>Fecha del pedido:</strong> {fechaPedido.toLocaleDateString()}
                </div>
                <div className="mb-4">
                    <strong>Fecha de entrega:</strong> {fechaEntrega.toLocaleDateString()}
                </div>
                <div className="mb-4">
                    <strong>Comprobante:</strong> {comprobante_p}
                </div>

                <h4 className="font-semibold text-lg mt-6 mb-2">Productos</h4>
                <ul className="list-disc pl-6">
                    {productos.map((prod) => (
                        <li key={prod.id}>
                            {prod.nombre} - {prod.cantidad} {prod.embalaje} (${prod.montoPorProducto} c/u)
                        </li>
                    ))}
                </ul>

                {/* Nuevo: subir comprobante */}
                <div className="mb-4">
                    <label htmlFor="" className="block text-sm font-medium text-blue-700 mb-1">
                        Subir comprobante
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>

                <div className="mt-6">
                    <button
                        onClick={IssueAlert}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                    >
                        Emitir alerta por faltante
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
