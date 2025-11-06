import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface ShiftScheduleRequest {
  empleados: string[];
  fechaInicio: string;
  fechaFin: string;
}

export interface ShiftScheduleResponse {
  success: boolean;
  messages: string[] | null;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class ShiftSchedulerService {
  private readonly baseUrl = 'http://localhost:8081/api/plan-semanal';
  private readonly fallbackEmployees = [
    'Ana Torres',
    'Carlos Díaz',
    'María González',
    'Juan Pérez'
  ];

  constructor(private readonly http: HttpClient) {}

  getEmployees(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.baseUrl}/empleados`)
      .pipe(catchError(() => of(this.fallbackEmployees)));
  }

  schedule(payload: ShiftScheduleRequest): Observable<ShiftScheduleResponse> {
    return this.http.post<ShiftScheduleResponse>(this.baseUrl, payload);
  }
}
