import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToCancelReservation(): void {
    this.router.navigate(['/cancelarreservas']);
  }

  goToClientes(): void {
    this.router.navigate(['/home/clientes']);
  }

  goToInventario(): void {
    this.router.navigate(['/inventario']);
  }

  goToProductos(): void {
    this.router.navigate(['/productos']);
  } 
}
