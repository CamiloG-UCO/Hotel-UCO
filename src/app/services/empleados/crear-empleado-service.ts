import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrearEmpleadoService {

  private readonly baseUrl = 'http://localhost:8080/api/empleados';
  private readonly urlTipos = 'http://localhost:8080/api/tipoIdentificacion';

  constructor(private http: HttpClient) {}

  /** Crear un nuevo empleado */
  crearEmpleado(empleado: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, empleado, { responseType: 'text' }).pipe(
      map(res => res),
      catchError(this.handleError)
    );
  }

  /** Consultar tipos de identificación desde el backend */
  consultarTiposIdentificacion(): Observable<any[]> {
    return this.http.get<any[]>(this.urlTipos).pipe(
      map(res => {
        console.log('📦 Tipos de identificación:', res);
        return res;
      }),
      catchError(this.handleError)
    );
  }

  /** Roles disponibles */
  consultarRoles(): Observable<string[]> {
    const roles = ['RECEPTIONIST', 'ADMIN', 'CUSTOMER', 'STAFF'];
    return of(roles);
  }

  /** Hoteles disponibles */
  consultarHoteles(): Observable<string[]> {
    const hoteles = [
      'Santa Marta Resort',
      'Hotel Caribe Deluxe',
      'Hotel Andino Plaza',
      'Medellín Sky Suites'
    ];
    return of(hoteles);
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
