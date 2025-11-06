import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReservationResponse } from '../../reservations.models';
import { CancelReservationDialogComponent } from '../cancel-reservation-dialog/cancel-reservation-dialog.component';

@Component({
  standalone: true,
  selector: 'app-reservation-item',
  imports: [],
  templateUrl: './reservation-item.component.html',
  styleUrl: './reservation-item.component.scss'
})
export class ReservationItemComponent {

  @Input() reservation: ReservationResponse | null = null;
  @Output() cancelClick = new EventEmitter<ReservationResponse>();

  constructor(
    public dialog: MatDialog
  ) {}

  onCancel() {
    if (!this.reservation) return;
    let dialogRef = this.dialog.open(CancelReservationDialogComponent, { width: "512px" });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.cancelClick.emit(this.reservation!);
      }
    });
  }
}
