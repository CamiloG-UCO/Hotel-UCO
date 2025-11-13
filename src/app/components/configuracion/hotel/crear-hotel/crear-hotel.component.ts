import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Hotel } from '../../../../services/configuracion/clases/Hotel';
import { hotelService } from '../../../../services/configuracion/hotel/hotel.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-crear-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-hotel.component.html',
  styleUrl: './crear-hotel.component.scss'
})
export class CrearHotelComponent {
  hotel: Hotel = new Hotel();
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private hotelService: hotelService,
    private router: Router
  ) {
    console.log('CrearHotelComponent iniciado');
  }

  onSubmit(): void {
    console.log('=== INICIO onSubmit ===');
    console.log('Datos del hotel:', this.hotel);
    
    if (!this.validateForm()) {
      console.log('Validación falló');
      return;
    }

    console.log('Validación exitosa, enviando al backend...');
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.hotelService.createHotel(this.hotel).subscribe({
      next: (response: string) => {
        console.log('✅ Respuesta exitosa del backend:', response);
        this.successMessage = response;
        this.isSubmitting = false;
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          console.log('Redirigiendo a /hoteles');
          this.router.navigate(['/hoteles']); // Ajusta la ruta según tu aplicación
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error del backend:', error);

        // Mostrar el mensaje que envíe el backend
        if (typeof error.error === 'string') {
          this.errorMessage = error.error;
        } 
        else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } 
        else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor.';
        } 
        else {
          this.errorMessage = 'Error al crear el hotel. Intente nuevamente.';
        }

        this.isSubmitting = false;
      }
    });
    console.log('=== FIN onSubmit ===');
  }

  validateForm(): boolean {
    console.log('Validando formulario...');
    
    // Solo validamos los campos obligatorios que el usuario debe llenar
    if (!this.hotel.nombre || this.hotel.nombre.trim() === '') {
      this.errorMessage = 'El nombre del hotel es obligatorio';
      console.log('Error: nombre vacío');
      return false;
    }

    if (!this.hotel.ciudad || this.hotel.ciudad.trim() === '') {
      this.errorMessage = 'La ciudad es obligatoria';
      console.log('Error: ciudad vacía');
      return false;
    }

    // Validación adicional de formato de teléfono si se proporciona
    if (this.hotel.telefono && this.hotel.telefono.trim() !== '') {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(this.hotel.telefono)) {
        this.errorMessage = 'El formato del teléfono no es válido';
        console.log('Error: formato de teléfono inválido');
        return false;
      }
    }

    console.log('✅ Validación exitosa');
    return true;
  }

  resetForm(): void {
    this.hotel = new Hotel();
    this.errorMessage = '';
    this.successMessage = '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToHome(){
    this.router.navigate(["/home"]);
  }

  goToHotelList(){
    this.router.navigate(["/hotel/list"]);
  }

}
