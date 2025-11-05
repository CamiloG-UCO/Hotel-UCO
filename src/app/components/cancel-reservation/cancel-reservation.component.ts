import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CancelReservationService } from '../../services/reservation/cancel-reservation/cancel-reservation.service';

@Component({
  selector: 'app-cancel-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cancel-reservation.component.html',
  styleUrl: './cancel-reservation.component.scss'
})
export class CancelReservationComponent implements OnInit {
  roomCode: string = '';
  booking: any = null;
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  showForm: boolean = true;

  constructor(private cancelReservationService: CancelReservationService) {}

  ngOnInit(): void {
    this.resetMessages();
  }

  /**
   * Busca una reserva por código de habitación
   */
  searchBooking(): void {
    if (!this.roomCode.trim()) {
      this.error = 'Por favor ingresa el código de la habitación';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.cancelReservationService.getBookingByRoom(this.roomCode).subscribe({
      next: (data) => {
        this.booking = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'No se encontró la reserva. Verifica el código de la habitación.';
        this.booking = null;
      }
    });
  }

  /**
   * Cancela la reserva
   */
  cancelBooking(): void {
    if (!this.booking) {
      this.error = 'No hay reserva seleccionada';
      return;
    }

    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.loading = true;
      this.error = null;

      this.cancelReservationService.cancelBooking(this.roomCode).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = response || 'Reserva cancelada exitosamente';
          this.booking = null;
          this.roomCode = '';
          setTimeout(() => this.resetMessages(), 3000);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error al cancelar la reserva. Intenta nuevamente.';
        }
      });
    }
  }

  /**
   * Reinicia el formulario
   */
  resetForm(): void {
    this.roomCode = '';
    this.booking = null;
    this.resetMessages();
  }

  /**
   * Limpia los mensajes de error y éxito
   */
  private resetMessages(): void {
    this.error = null;
    this.success = null;
  }
}
