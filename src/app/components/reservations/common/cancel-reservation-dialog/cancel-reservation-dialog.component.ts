import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButton} from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-cancel-reservation-dialog',
  imports: [MatButton],
  templateUrl: './cancel-reservation-dialog.component.html',
  styleUrl: './cancel-reservation-dialog.component.scss'
})
export class CancelReservationDialogComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<CancelReservationDialogComponent>
  ) {}

  onDesicion(d: boolean) {
    this.dialogRef.close(d);
  }
}
