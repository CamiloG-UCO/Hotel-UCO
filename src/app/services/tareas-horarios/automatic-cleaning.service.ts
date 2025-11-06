import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AutomaticCleaningTaskRequest {
  hotelName: string;
  roomCode: string;
  newStatus: string;
}

export interface AutomaticCleaningTaskResponse {
  success: boolean;
  message?: string | null;
  taskId?: number | null;
  hotelName?: string | null;
  roomCode?: string | null;
  description?: string | null;
  assignedTo?: string | null;
  estimatedMinutes?: number | null;
  status?: string | null;
  createdAt?: string | null;
  error?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AutomaticCleaningService {
  private readonly baseUrl = 'http://localhost:8081/api/v1/automatic-cleaning-tasks';

  constructor(private readonly http: HttpClient) {}

  create(payload: AutomaticCleaningTaskRequest): Observable<AutomaticCleaningTaskResponse> {
    return this.http.post<AutomaticCleaningTaskResponse>(this.baseUrl, payload);
  }
}
