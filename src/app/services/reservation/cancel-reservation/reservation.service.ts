import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ReservationResponse } from '../../../components/reservations/reservations.models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private readonly apiUrl = 'http://localhost:8080/api/v1';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDummyBooking(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/rest/booking/dummy`,
      { headers: this.getAuthHeaders() }
    );
  }

  getAllBookings(): Observable<any[]> {
    return this.http.get<ReservationResponse[]>(
      `${this.apiUrl}/reservations`,
      { headers: this.getAuthHeaders() }
    );
  }

  getBookingByRoom(userEmail: string, roomCode: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/rest/booking/client/${userEmail}/room/${roomCode}`,
      { headers: this.getAuthHeaders() }
    );
  }

  createBooking(data: any) {
    return this.http.post(`${this.apiUrl}/reservations`, data, { headers: this.getAuthHeaders() })
  }

  checkIn(reservationId: string) {
    return this.http.patch(`${this.apiUrl}/reservations/check-in/${reservationId}`, null, { headers: this.getAuthHeaders() });
  }

  cancelBooking(userEmail: string, roomCode: string): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/rest/booking/client/${userEmail}/room/${roomCode}`,
      { headers: this.getAuthHeaders(), responseType: 'text' }
    );
  }
}
