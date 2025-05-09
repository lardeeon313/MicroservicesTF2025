import { OrderProps } from "../components/Order";

export const MockOrders: OrderProps[] = [
    {
      id: "PD01",
      cliente: 'Restaurante "El sabor"',
      direccion: "Av. Libertad 1234",
      estado: "Emitido",
      tipoLocal: "Restaurante",
      productos: [
        {
          id: "P1",
          nombre: "Aceite de oliva",
          cantidad: 5,
          embalaje: "Botella",
          montoPorProducto: 85
        },
        {
          id: "P2",
          nombre: "Harina de trigo",
          cantidad: 10,
          embalaje: "Bolsa",
          montoPorProducto: 33
        }
      ],
      fechaPedido: new Date(2023, 4, 15),
      fechaEntrega: new Date(2023, 4, 18),
      comprobante_p: "comprobante_001.pdf",
      montoTotal: 89.5,
      detalleDeEntrega: "Entregar por la puerta trasera, preguntar por Carlos",
      correoelectronico:"ejemplo1@gmail.com",
      telefono:"3516705453"
    },
    {
        id: "PD02",
        cliente: 'Supermercado "Lo de trejo"',
        direccion: "Calle San Martín 567",
        estado: "En preparacion",
        tipoLocal: "Supermercado",
        productos: [
          { 
            id: "P4", 
            nombre: "Arroz premium", 
            cantidad: 20, 
            embalaje: "Bolsa", 
            montoPorProducto: 4.8 
          },
          { 
            id: "P5", 
            nombre: "Aceite vegetal", 
            cantidad: 15, 
            embalaje: "Botella", 
            montoPorProducto: 6.2 
          }
        ],
        fechaPedido: new Date(2023, 4, 16),
        fechaEntrega: new Date(2023, 4, 20),
        comprobante_p: "comprobante_002.pdf",
        montoTotal: 213.0,
        detalleDeEntrega: "Coordinar con el encargado de recepción, horario 9-12hs",
        correoelectronico:"ejemplo2@gmail.com",
        telefono:"3516705434"
    },
    {
      id: "PD03",
      cliente: 'Panadería "El Molino"',
      direccion: "Calle Rivadavia 789",
      estado: "Confirmado",
      tipoLocal: "Panadería",
      productos: [
        {
          id: "P6",
          nombre: "Levadura fresca",
          cantidad: 8,
          embalaje: "Paquete",
          montoPorProducto: 3.5,
        },
        {
          id: "P7",
          nombre: "Azúcar refinada",
          cantidad: 12,
          embalaje: "Bolsa",
          montoPorProducto: 4.2,
        },
      ],
      fechaPedido: new Date(2023, 4, 17),
      fechaEntrega: new Date(2023, 4, 19),
      comprobante_p: "comprobante_003.pdf",
      montoTotal: 78.4,
      detalleDeEntrega: "Entregar antes de las 7:00 AM, preguntar por María",
      correoelectronico: "ejemplo3@gmail.com",
      telefono: "3516705455",
    },
];
  
