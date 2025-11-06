import { Producto } from './producto.model';

export interface Inventario {
  id?: number;
  producto: Producto;
  hotel: string;
  ubicacion: string;
  cantidad: number;
  stockMinimo: number;
  ultimaActualizacion: string;
}
