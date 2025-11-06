import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TaskStatus = 'Pendiente' | 'En progreso' | 'Completada';

export interface TaskPayload {
  description: string;
  assignedEmployee: string;
  status: TaskStatus;
}

export interface TaskResponse extends TaskPayload {
  taskId: string;
  startTime?: string | null;
  endTime?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TaskManagementService {
  private readonly baseUrl = 'http://localhost:8081/tasks';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${this.baseUrl}/all`);
  }

  create(payload: TaskPayload): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.baseUrl}/create`, payload);
  }

  update(taskId: string, payload: TaskResponse): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.baseUrl}/update/${taskId}`, payload);
  }
}
