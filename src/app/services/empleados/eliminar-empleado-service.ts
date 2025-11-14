import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EliminarEmpleadoService {

  private readonly baseUrl = 'http://localhost:8080/api/empleados';

  constructor(private http: HttpClient) {}

  // Buscar por código (GET correcto)
  obtenerEmpleadoPorCodigo(code: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/consultar/${code}`);
  }

  // Eliminar por código (DELETE correcto)
  eliminarEmpleado(code: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/codigo/${code}`);
  }
}