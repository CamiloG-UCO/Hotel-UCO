import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EliminarEmpleadoService {

  private readonly baseUrl = 'http://localhost:8080/api/empleados';

  constructor(private http: HttpClient) {}

  obtenerEmpleadoPorId(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  eliminarEmpleado(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
