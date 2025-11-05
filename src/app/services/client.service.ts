import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root' // Angular 19 lo sigue usando igual
})
export class ClientService {
  private readonly apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  findByDocument(number: string): Observable<Client> {
    const params = new HttpParams().set('number', number);
    return this.http.get<Client>(`${this.apiUrl}/document`, { params });
  }

  findByEmail(email: string): Observable<Client> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Client>(`${this.apiUrl}/email`, { params });
  }

  findByPhone(phone: string): Observable<Client> {
    const params = new HttpParams().set('phone', phone);
    return this.http.get<Client>(`${this.apiUrl}/phone`, { params });
  }

  existsByDocument(type: string, number: string): Observable<boolean> {
    const params = new HttpParams().set('type', type).set('number', number);
    return this.http.get<boolean>(`${this.apiUrl}/exists/document`, { params });
  }

  existsByEmail(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(`${this.apiUrl}/exists/email`, { params });
  }

  existsByPhone(phone: string): Observable<boolean> {
    const params = new HttpParams().set('phone', phone);
    return this.http.get<boolean>(`${this.apiUrl}/exists/phone`, { params });
  }
}
