import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ShiftSchedulerService } from '../../../services/tareas-horarios/shift-scheduler.service';
import { resolveApiError } from '../../../services/tareas-horarios/api-error.util';

interface NotificationMessage {
  title: string;
  items: string[];
}

@Component({
  selector: 'app-shift-scheduler',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './shift-scheduler.component.html',
  styleUrls: ['./shift-scheduler.component.scss']
})
export class ShiftSchedulerComponent implements OnInit {
  protected readonly form: FormGroup;

  protected readonly employees = signal<string[]>([]);
  protected readonly employeesLoading = signal(false);
  protected readonly scheduleLoading = signal(false);
  protected readonly successMessage = signal<NotificationMessage | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly hasEmployees = computed(() => this.employees().length > 0);

  constructor(
    private readonly fb: FormBuilder,
    private readonly shiftService: ShiftSchedulerService
  ) {
    this.form = this.fb.group({
      employees: [[], Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  protected loadEmployees(): void {
    this.employeesLoading.set(true);
    this.shiftService.getEmployees().subscribe({
      next: (employees) => {
        this.employeesLoading.set(false);
        this.employees.set(employees ?? []);
      },
      error: () => {
        this.employeesLoading.set(false);
        this.employees.set([]);
      }
    });
  }

  protected scheduleShifts(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawEmployees = this.form.value.employees as string[];
    const startDate = this.form.value.startDate as Date;
    const endDate = this.form.value.endDate as Date;

    if (!this.validateDateRange(startDate, endDate)) {
      return;
    }

    const payload = {
      empleados: rawEmployees,
      fechaInicio: formatDate(startDate, 'yyyy-MM-dd', 'en-CA'),
      fechaFin: formatDate(endDate, 'yyyy-MM-dd', 'en-CA')
    };

    this.scheduleLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.shiftService.schedule(payload).subscribe({
      next: (response) => {
        this.scheduleLoading.set(false);

        if (response.success) {
          const items = response.messages ?? [
            'Turnos agendados correctamente.'
          ];
          this.successMessage.set({
            title: 'Agendamiento exitoso',
            items
          });
          this.form.reset({ employees: [], startDate: '', endDate: '' });
        } else {
          this.errorMessage.set(
            response.error ?? 'No fue posible agendar los turnos.'
          );
        }
      },
      error: (error) => {
        this.scheduleLoading.set(false);
        this.errorMessage.set(resolveApiError(error));
      }
    });
  }

  protected fieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  protected minDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  protected selectionDisabled(): boolean {
    return this.employeesLoading() || !this.hasEmployees();
  }

  private validateDateRange(start: Date, end: Date): boolean {
    if (!(start instanceof Date) || !(end instanceof Date)) {
      this.errorMessage.set('Debes seleccionar una fecha de inicio y fin válidas.');
      return false;
    }

    const today = this.minDate();

    if (start < today || end < today) {
      this.errorMessage.set('Solo puedes agendar turnos a partir de la fecha actual.');
      return false;
    }

    if (end < start) {
      this.errorMessage.set('La fecha fin debe ser posterior o igual a la fecha inicio.');
      return false;
    }

    return true;
  }
}
