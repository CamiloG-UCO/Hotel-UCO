import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CancelReservationService } from '../../services/reservation/cancel-reservation/cancel-reservation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cancel-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cancel-reservation.component.html',
  styleUrl: './cancel-reservation.component.scss'
})
export class CancelReservationComponent implements OnInit {
  dummyBooking: any = null;
  bookings: any[] = [];
  loading: boolean = false;
  canceling: boolean = false;

  constructor(
    private cancelReservationService: CancelReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllBookings();
  }

  loadDummyBooking(): void {
    this.loading = true;
    this.cancelReservationService.getDummyBooking().subscribe({
      next: (data) => {
        this.dummyBooking = data;
        this.loading = false;
        
        // Mostrar en alerta SweetAlert2
        Swal.fire({
          title: '✅ Reserva de Prueba Generada',
          html: `
            <div style="text-align: left; font-size: 0.95rem;">
              <p><strong>Cliente:</strong> ${data.client?.name}</p>
              <p><strong>Email:</strong> ${data.client?.email}</p>
              <p><strong>Hotel:</strong> ${data.room?.hotel?.name}</p>
              <p><strong>Habitación:</strong> ${data.room?.code}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // Refrescar la tabla después de cerrar la alerta
          this.loadAllBookings();
        });
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar la reserva de prueba', 'error');
      }
    });
  }

  loadAllBookings(): void {
    this.loading = true;
    this.cancelReservationService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar las reservas', 'error');
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  cancelBooking(roomCode: string, bookingId: string, userEmail: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas cancelar la reserva de la habitación ${roomCode}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver atrás'
    }).then((result) => {
      if (result.isConfirmed) {
        this.canceling = true;
        this.cancelReservationService.cancelBooking(userEmail, roomCode).subscribe({
          next: (response) => {
            this.canceling = false;
            Swal.fire('Éxito', 'Reserva cancelada correctamente', 'success').then(() => {
              this.loadAllBookings();
            });
          },
          error: (err) => {
            this.canceling = false;
            console.error('Error al cancelar:', err);
            Swal.fire('Error', 'No se pudo cancelar la reserva', 'error');
          }
        });
      }
    });
  }
}
