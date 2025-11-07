import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../../models/client.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateclientService {

  private apiUrl = 'http://localhost:8080/api/clientes';  
  
  private client?: Client;

  setClient(client: Client) {
    this.client = client;
  }

  getClient(): Client | undefined {
    return this.client;
  }

  clearClient() {
    this.client = undefined;
  }


  constructor(private http: HttpClient) { }


  updateClient(client: any): Observable<any> {
    return this.http.put(this.apiUrl,client,{responseType: 'text'})
  }
}
