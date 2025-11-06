import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type AttendanceAction = 'entrada' | 'salida';

export interface AttendanceEmployee {
  id: number;
  tipoId: string;
  nombreCompleto: string;
}

export interface AttendanceRecord {
  id: number;
  empleado: AttendanceEmployee | null;
  horaEntradaAsignada: string | null;
  horaSalidaAsignada: string | null;
  horaEntradaReal: string | null;
  horaSalidaReal: string | null;
  minutosRetraso: number;
  minutosTrabajados: number;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly baseUrl = 'http://localhost:8081/api/asistencia';

  constructor(private readonly http: HttpClient) {}

  register(action: AttendanceAction, employeeId: number): Observable<AttendanceRecord> {
    return this.http.post<AttendanceRecord>(`${this.baseUrl}/${action}/${employeeId}`, {});
  }

  registerEntry(employeeId: number): Observable<AttendanceRecord> {
    return this.register('entrada', employeeId);
  }

  registerExit(employeeId: number): Observable<AttendanceRecord> {
    return this.register('salida', employeeId);
  }
}
