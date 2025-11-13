import { Component, OnInit } from '@angular/core';
import { ReservationItemComponent } from './common/reservation-item/reservation-item.component';
import { ReservationService } from '../../services/reservation/cancel-reservation/reservation.service';
import { Router } from '@angular/router';
import { ReservationResponse } from './reservations.models';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateReservationDialogComponent } from './common/create-reservation-dialog/create-reservation-dialog.component';

@Component({
  selector: 'app-reservations',
  imports: [CommonModule, ReservationItemComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit {

  protected loading = false;
  protected reservations: ReservationResponse[] = [];

  constructor(
    private readonly reservationService: ReservationService,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.reservationService.getAllBookings().subscribe({
      next: r => this.reservations = r,
      error: e => console.error(e),
      complete: () => this.loading = false
    })
  }

  onCancelReservation(reservation: ReservationResponse) {
    if (!reservation) return;
    this.reservationService.cancelBooking(reservation?.userEmail, reservation?.reservationCode).subscribe({
      next: r => this.loadReservations(),
      error: e => console.error(e)
    })
  }

  onCheckInReservation(reservationId: string) {
    if (!reservationId) return;
    this.reservationService.checkIn(reservationId).subscribe({
      next: () => this.loadReservations(),
      error: e => console.error(e),
    })
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateReservationDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reservationService.createBooking(result).subscribe({
          next: () => this.loadReservations(),
          error: (e) => console.error(e)
        });
      }
    });
  }
}
