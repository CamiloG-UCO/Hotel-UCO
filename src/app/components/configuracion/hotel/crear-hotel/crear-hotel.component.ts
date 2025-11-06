import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Hotel } from '../../../../services/configuracion/clases/Hotel';
import { hotelService } from '../../../../services/configuracion/hotel/hotel.service';

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
      next: (response) => {
        console.log('✅ Respuesta exitosa del backend:', response);
        this.successMessage = 'Hotel creado exitosamente';
        this.isSubmitting = false;
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          console.log('Redirigiendo a /hoteles');
          this.router.navigate(['/hoteles']); // Ajusta la ruta según tu aplicación
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Error al crear el hotel. Por favor intente nuevamente.';
        this.isSubmitting = false;
        console.error('Error:', error);
        // Manejo de diferentes tipos de errores
        if (error.status === 400) {
          this.errorMessage = 'Datos inválidos. Verifique los campos del formulario.';
        } else if (error.status === 409) {
          this.errorMessage = 'Ya existe un hotel con estos datos.';
        } else if (error.status === 500) {
          this.errorMessage = 'Error en el servidor. Intente nuevamente más tarde.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifique que el backend esté corriendo.';
        } else {
          this.errorMessage = error.error || 'Error al crear el hotel. Por favor intente nuevamente.';
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

}
