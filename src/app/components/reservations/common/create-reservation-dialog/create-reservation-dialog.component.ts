import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-reservation-dialog',
  standalone: true,
  templateUrl: './create-reservation-dialog.component.html',
  styleUrls: ['./create-reservation-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule
  ]
})
export class CreateReservationDialogComponent {
  reservationForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<CreateReservationDialogComponent>
  ) {
    this.reservationForm = this.fb.group({
      roomId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  onSave() {
    if (this.reservationForm.valid) {
      this.dialogRef.close(this.reservationForm.value);
    }
  }
}
