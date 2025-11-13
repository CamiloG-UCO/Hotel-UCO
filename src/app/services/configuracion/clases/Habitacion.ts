export interface HabitacionResponse {
  id: string;
  habitacionId: string;
  nombre: string;
  nombreHotel: string;
  tipo: string;
  capacidad: number;
  estado: 'ACTIVO' | 'INACTIVO';
  estadoDescripcion: string;
  motivoDesactivacion?: string;
  fechaCambioEstado?: string;
  usuarioCambio?: string;
  permiteReservas: boolean;
  mensaje?: string;
}

export interface HabitacionPage {
  content: HabitacionResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface CrearHabitacionPayload {
  habitacionId: string;
  nombre: string;
  tipo: string;
  capacidad: number;
  hotelCodigo: string;
}

export const ESTADOS_HABITACION: Array<HabitacionResponse['estado']> = ['ACTIVO', 'INACTIVO'];

export const TIPOS_HABITACION: string[] = [
  'STANDARD',
  'PREMIUM',
  'SUITE',
  'ECONOMICA',
  'EJECUTIVA'
];
