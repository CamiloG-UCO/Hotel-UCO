import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Hotel } from '../clases/Hotel';

@Injectable({
  providedIn: 'root'
})
export class hotelService {

  private readonly apiUrl= "http://localhost:8080/api/v1/hotel"

  constructor(private readonly http: HttpClient) { }

  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/all`);
  }

  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`); 
  }

    getHotelByCodigo(codigo: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/HC/${codigo}`); 
  }
  updateHotel(hotelId: string, hotel: Hotel): Observable<any> {
    
    return this.http.put(`${this.apiUrl}/${hotelId}`, hotel, { 
      responseType: 'text' 
    });

  }

}
