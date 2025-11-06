import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActualizarEmpleadoService {

  private readonly baseUrl = 'http://localhost:8080/api/empleados';

  constructor(private http: HttpClient) {}

  /** Obtener empleado por ID */
  obtenerEmpleadoPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /** Obtener empleado por código */
  obtenerEmpleadoPorCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/code/${code}`).pipe(
      catchError(this.handleError)
    );
  }

  /** Actualizar empleado por ID */
  actualizarEmpleadoPorId(id: string, empleado: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.baseUrl}/${id}`, empleado, { headers }).pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  /** Actualizar empleado por código */
  actualizarEmpleadoPorCode(code: string, empleado: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.baseUrl}/code/${code}`, empleado, { headers }).pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  /** Manejo de errores HTTP */
  private handleError(error: HttpErrorResponse) {
    let mensaje = 'Error desconocido';
    if (error.status === 0) {
      mensaje = 'No se pudo conectar con el servidor.';
    } else if (error.error instanceof ErrorEvent) {
      mensaje = `Error del cliente: ${error.error.message}`;
    } else {
      mensaje = error.error || `Error ${error.status}: ${error.statusText}`;
    }
    console.error('Error HTTP:', error);
    return throwError(() => mensaje);
  }
}
