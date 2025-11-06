import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import {
  AttendanceRecord,
  AttendanceService,
  AttendanceAction
} from '../../../services/tareas-horarios/attendance.service';
import { resolveApiError } from '../../../services/tareas-horarios/api-error.util';

@Component({
  selector: 'app-attendance-control',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatProgressBarModule,
    MatDividerModule
  ],
  templateUrl: './attendance-control.component.html',
  styleUrls: ['./attendance-control.component.scss']
})
export class AttendanceControlComponent {
  protected readonly form: FormGroup;

  protected readonly displayedColumns = [
    'id',
    'employee',
    'entradaAsignada',
    'entradaReal',
    'salidaAsignada',
    'salidaReal',
    'minutosRetraso',
    'minutosTrabajados'
  ];

  protected readonly records = signal<AttendanceRecord[]>([]);
  protected readonly loading = signal<AttendanceAction | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly message = signal<string | null>(null);
  protected readonly hasRecords = computed(() => this.records().length > 0);

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AttendanceService
  ) {
    this.form = this.fb.group({
      employeeId: ['', Validators.required]
    });
  }

  protected registerEntry(): void {
    this.handleRequest('entrada');
  }

  protected registerExit(): void {
    this.handleRequest('salida');
  }

  protected isLoading(action: AttendanceAction): boolean {
    return this.loading() === action;
  }

  protected trackByRecord(_: number, record: AttendanceRecord): number {
    return record.id;
  }

  protected fieldInvalid(group: FormGroup, field: string): boolean {
    const control = group.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private handleRequest(action: AttendanceAction): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawId = this.form.value.employeeId;
    const employeeId = Number(rawId);

    if (!employeeId || Number.isNaN(employeeId) || employeeId <= 0) {
      this.error.set('El ID de empleado debe ser un número entero positivo.');
      return;
    }

    this.loading.set(action);
    this.error.set(null);
    this.message.set(null);

    const request$ =
      action === 'entrada'
        ? this.service.registerEntry(employeeId)
        : this.service.registerExit(employeeId);

    request$.subscribe({
      next: (response) => {
        this.loading.set(null);
        const actionLabel = action === 'entrada' ? 'Entrada' : 'Salida';
        this.message.set(`${actionLabel} registrada correctamente.`);
        this.records.set([response, ...this.records()]);
      },
      error: (error) => {
        this.loading.set(null);
        this.error.set(resolveApiError(error));
      }
    });
  }
}
