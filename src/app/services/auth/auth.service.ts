import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'https://ms-services-users.up.railway.app/api/v1/auth';

  private readonly rolesUrl = 'https://ms-services-users.up.railway.app/api/v1/roles';

  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService
  ) {}

  login(data: { email: string; password: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/login`, data).subscribe({
        next: (response) => {
          const token = response.token;
          this.cookieService.set('auth_token', token, { path: '/', secure: true });
          this.cookieService.set('email', data.email, { path: '/', secure: true });
          observer.next(response);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  register(data: { name: string; email: string; password: string; role: { id: string } }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(this.rolesUrl);
  }


  isAuthenticated(): boolean {
    return this.cookieService.check('auth_token');
  }

  getToken(): string {
    return this.cookieService.get('auth_token');
  }

  getEmail(): string {
    return this.cookieService.get('email');
  }

  logout(): void {
    this.cookieService.delete('auth_token', '/');
    this.cookieService.delete('email', '/');
  }
}
