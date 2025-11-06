import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { hotelService } from '../../../../services/configuracion/hotel/hotel.service';
import { Hotel } from '../../../../services/configuracion/clases/Hotel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actualizar-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-hotel.component.html',
  styleUrl: './actualizar-hotel.component.scss'
})
export class ActualizarHotelComponent {
    hotel: Hotel = new Hotel(); 
    isLoading = true;

    ngOnInit(): void{
    const state = this.router.getCurrentNavigation()?.extras.state;
    
    if (state && state['hotelData']) {
      this.hotel = state['hotelData'];
      this.isLoading = false;
    } else {

      const id = this.route.snapshot.paramMap.get('id');
      
      if (id) {
        this.hotelService.getHotelById(id).subscribe({
          next: (data) => {
            this.hotel = data;
            this.isLoading = false;
          },
          error: (err) => {
            console.error("Error cargando hotel", err);
            this.isLoading = false;
            this.router.navigate(['/hotel/list']); 
          }
        });
      }
    }
    }

    constructor(
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute,
      private hotelService: hotelService
    ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  guardarActualizacion(): void {
    if (this.hotel.id) {
      this.hotelService.updateHotel(this.hotel.id, this.hotel).subscribe({
        next: () => {
          alert('Hotel actualizado con éxito');
          this.router.navigate(['/hotel/list']);
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          alert('Hubo un error al actualizar');
        }
      });
    }
  }
  cancelar(): void {
    this.router.navigate(['/hotel/list']);
  }

}
