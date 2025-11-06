import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CreateClientDto } from '../../models/create-client.dto';

// Si ya usas environments, reemplaza por environment.apiBaseUrl
const API_BASE = 'http://localhost:8080';
const CLIENTS_BASE = `${API_BASE}/api/clientes`;

@Injectable({ providedIn: 'root' })
export class ClientsCommandService {
  constructor(private http: HttpClient) {}

  create(dto: CreateClientDto): Observable<void> {
    return this.http.post(CLIENTS_BASE, dto, { observe: 'response' }).pipe(
      map(resp => {
        if (resp.status !== 201 && resp.status !== 200) {
          throw new Error(`Estado inesperado: ${resp.status}`);
        }
        return;
      }),
      catchError((err: HttpErrorResponse) => {
        const msg =
          err.error?.message ||
          err.error?.detail ||
          err.error?.error ||
          err.statusText ||
          'Error al crear el cliente';
        return throwError(() => new Error(msg));
      })
    );
  }
}
