import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CrearHabitacionPayload,
  HabitacionPage,
  HabitacionResponse
} from '../clases/Habitacion';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/habitaciones';

  constructor(private readonly http: HttpClient) {}

  crearHabitacion(payload: CrearHabitacionPayload): Observable<string> {
    const params = new HttpParams()
      .set('habitacionId', payload.habitacionId)
      .set('nombre', payload.nombre)
      .set('tipo', payload.tipo)
      .set('capacidad', payload.capacidad.toString())
      .set('hotelCodigo', payload.hotelCodigo);

    return this.http.post(this.apiUrl, null, {
      params,
      responseType: 'text'
    });
  }

  listarHabitacionesPaginadas(page: number, size: number): Observable<HabitacionPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<HabitacionPage>(this.apiUrl, { params });
  }

  listarPorEstado(estado: HabitacionResponse['estado']): Observable<HabitacionResponse[]> {
    const params = new HttpParams().set('estado', estado);
    return this.http.get<HabitacionResponse[]>(`${this.apiUrl}/por-estado`, { params });
  }

  listarPorHotel(hotelCodigo: string): Observable<HabitacionResponse[]> {
    const params = new HttpParams().set('hotelCodigo', hotelCodigo);
    return this.http.get<HabitacionResponse[]>(`${this.apiUrl}/por-hotel`, { params });
  }

  listarPorTipo(tipo: string): Observable<HabitacionResponse[]> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<HabitacionResponse[]>(`${this.apiUrl}/por-tipo`, { params });
  }

  desactivarHabitacion(payload: {
    nombreHotel: string;
    numeroHabitacion: string;
    motivoDesactivacion: string;
    usuarioSolicitante: string;
  }): Observable<string> {
    return this.http.post<HabitacionResponse>(`${this.apiUrl}/desactivar`, payload).pipe(
      map(response => response.mensaje || 'Habitación desactivada por mantenimiento correctamente.')
    );
  }
}
