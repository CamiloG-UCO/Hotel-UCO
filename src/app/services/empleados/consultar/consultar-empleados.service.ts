import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConsultarEmpleadosService {

  private readonly baseUrl = 'http://localhost:8080/api/empleados';

  constructor(private http: HttpClient) {}

  getAllEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  getEmpleadoByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${code}`).pipe(
      catchError(this.handleError)
    );
  }

  getEmpleadosByHotel(hotel: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/hotel/${hotel}`).pipe(
      catchError(this.handleError)
    );
  }

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
