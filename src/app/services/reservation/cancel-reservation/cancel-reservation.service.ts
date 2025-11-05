import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CancelReservationService {

  private readonly apiUrl = 'http://localhost:8080/api/v1/rest/booking';

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
      `${this.apiUrl}/dummy`,
      { headers: this.getAuthHeaders() }
    );
  }

  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/all`,
      { headers: this.getAuthHeaders() }
    );
  }

  getBookingByRoom(userEmail: string, roomCode: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/client/${userEmail}/room/${roomCode}`,
      { headers: this.getAuthHeaders() }
    );
  }

  cancelBooking(userEmail: string, roomCode: string): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/client/${userEmail}/room/${roomCode}`,
      { headers: this.getAuthHeaders(), responseType: 'text' }
    ) as Observable<string>;
  }
}
