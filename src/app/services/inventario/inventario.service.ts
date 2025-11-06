import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Inventario } from '../../models/inventario.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/inventario';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  registrarProducto(productoId: number, cantidad: number, ubicacion: string): Observable<Inventario> {
    const params = new HttpParams()
      .set('productoId', productoId.toString())
      .set('cantidad', cantidad.toString())
      .set('ubicacion', ubicacion);

    return this.http.post<Inventario>(`${this.apiUrl}/registrar`, null, { params }).pipe(
      catchError(this.handleError)
    );
  }

  actualizarStock(productoId: number, ubicacion: string, cantidadNueva: number): Observable<Inventario> {
    const params = new HttpParams()
      .set('productoId', productoId.toString())
      .set('ubicacion', ubicacion)
      .set('cantidadNueva', cantidadNueva.toString());

    return this.http.put<Inventario>(`${this.apiUrl}/actualizar-stock`, null, { params }).pipe(
      catchError(this.handleError)
    );
  }

  obtenerBajoStock(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.apiUrl}/bajo-stock`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let mensaje = 'Error desconocido';
    if (error.status === 0) {
      mensaje = 'No se pudo conectar con el servidor.';
    } else if (error.status === 404) {
      mensaje = 'Recurso no encontrado.';
    } else if (error.status === 401) {
      mensaje = 'No autorizado. Por favor inicie sesión.';
    } else {
      mensaje = error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }
    console.error('Error HTTP:', error);
    return throwError(() => mensaje);
  }
}
