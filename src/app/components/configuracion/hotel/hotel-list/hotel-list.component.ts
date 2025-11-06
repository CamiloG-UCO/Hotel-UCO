import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Hotel } from '../../../../services/configuracion/clases/Hotel';
import { hotelService } from '../../../../services/configuracion/hotel/hotel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss'
})
export class HotelListComponent {

  hotels: Hotel[] = [];
  terminoBusqueda: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private hotelService: hotelService
  ) {}

  ngOnInit(): void{
    this.getHotels();
  }

  goToHome(){
    this.router.navigate(["/home"]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToCreateHotel(){
    this.router.navigate(['/hotel/new']);
  }

  goToEditHotel(hotel: Hotel): void { 
    this.router.navigate(['/hotel/edit', hotel.id], {
      state: { hotelData: hotel }
    });
  }

  goToViewHotel(){
    this.router.navigate(['/hotel/view']);
  }

buscarHotel(): void {
    // Si la barra de búsqueda está vacía, llama a la función original
    if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
      this.getHotels();
      return; // Termina la función aquí
    }

    // Si hay un término, llama al servicio para buscar por código
    this.hotelService.getHotelByCodigo(this.terminoBusqueda).subscribe({
      next: (hotelEncontrado) => {
        // Si se encuentra, actualiza el array 'hotels' para mostrar solo ese
        this.hotels = [hotelEncontrado];
      },
      error: (err) => {
        // Si el servicio da un error (ej. 404 No Encontrado)
        console.error("Error al buscar por código:", err);
        this.hotels = []; // Limpia la tabla
        alert('No se encontró ningún hotel con ese código.');
      }
    });
  }


getHotels(): void{
    this.hotelService.getAllHotels().subscribe({
      next: (Response: Hotel[]) =>{
        this.hotels = Response;
        console.log('Hoteles recibidos:', this.hotels); 
      },
      error: (err) => {
        console.error('Error al obtener hoteles:', err);
      }
    })
  }
}
