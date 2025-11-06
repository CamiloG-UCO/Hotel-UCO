import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import necesario para *ngFor y *ngIf
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-list',
  standalone: true, // Componente independiente
  imports: [CommonModule, HttpClientModule, RouterLink], // ✅ Aquí agregamos CommonModule
  styleUrls: ['./client-list.component.scss'],
  templateUrl: './client-list.component.html',
})
export class ClientListComponent implements OnInit {
  clients: Client[] = []; 
    selectedClient?: Client;

  constructor(private readonly clientService: ClientService,
    private router: Router) {}

  ngOnInit(): void {
  }
  goHome(): void {
    this.router.navigate(['/home']);
  }

  loadAllClients(): void {
    this.selectedClient = undefined; // ✅ Limpia selección
    this.clientService.findAll().subscribe({
      next: data => this.clients = data,
      error: err => console.error('Error al cargar clientes', err)
    });
  }

  getClientByDocument(number: string): void {
    this.clientService.findByDocument(number).subscribe({
      next: data => this.selectedClient = data,
      error: err => {
        console.error(err);
        this.selectedClient = undefined;
      }
    });
  }

  getClientByEmail(email: string): void {
    this.clientService.findByEmail(email).subscribe({
      next: data => this.selectedClient = data,
      error: err => {
        console.error(err);
        this.selectedClient = undefined;
      }
    });
  }


  getClientByPhone(phone: string): void {
    this.clientService.findByPhone(phone).subscribe({
      next: data => this.selectedClient = data,
      error: err => {
        console.error(err);
        this.selectedClient = undefined;
      }
    });
  }

editClient(client: Client): void {
  this.clientService.setSelectedClient(client);
  this.router.navigate(['/home/clientes/update']);

}

}
