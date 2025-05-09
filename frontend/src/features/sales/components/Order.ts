export type OrderStatus = "Emitido" | "En preparacion" | "Entregado" | "Confirmado";

export interface ProductoProps {
  id: string;
  nombre: string;
  cantidad: number;
  embalaje: string;
  montoPorProducto: number;
}

export interface OrderProps {
  id: string;
  cliente: string;
  direccion: string;
  estado: OrderStatus;
  tipoLocal: string;
  productos: ProductoProps[];
  fechaPedido: Date;
  fechaEntrega: Date;
  comprobante_p: string | null;
  montoTotal: number;
  detalleDeEntrega: string;
  //datos que faltan: 
  correoelectronico:string;
  telefono:string; 
}

