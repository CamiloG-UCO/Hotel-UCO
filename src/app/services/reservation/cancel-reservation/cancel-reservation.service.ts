import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CancelReservationService {

  private readonly apiUrl = 'http://localhost:8080/api/v1/rest/booking';

  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService
  ) {}

  getBookingByRoom(roomCode: string): Observable<any> {
    const userEmail = this.cookieService.get('email');
    return this.http.get<any>(
      `${this.apiUrl}/client/${userEmail}/room/${roomCode}`
    );
  }

  cancelBooking(roomCode: string): Observable<string> {
    const userEmail = this.cookieService.get('email');
    return this.http.delete<string>(
      `${this.apiUrl}/client/${userEmail}/room/${roomCode}`
    );
  }
}
