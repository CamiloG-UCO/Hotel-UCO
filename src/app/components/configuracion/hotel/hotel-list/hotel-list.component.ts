import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Hotel } from '../../../../services/configuracion/clases/Hotel';
import { hotelService } from '../../../../services/configuracion/hotel/hotel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss'
})
export class HotelListComponent {

  hotels: Hotel[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private hotelService: hotelService
  ) {}

  ngOnInit(): void{
    this.getHotels();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToCreateHotel(){
    this.router.navigate(['/hotel/new']);
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
