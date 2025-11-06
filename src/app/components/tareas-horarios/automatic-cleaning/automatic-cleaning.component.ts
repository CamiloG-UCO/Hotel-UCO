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
  AutomaticCleaningService,
  AutomaticCleaningTaskRequest,
  AutomaticCleaningTaskResponse
} from '../../../services/tareas-horarios/automatic-cleaning.service';
import { resolveApiError } from '../../../services/tareas-horarios/api-error.util';

interface CleaningTaskView {
  taskId: number | null | undefined;
  hotelName: string | null | undefined;
  roomCode: string | null | undefined;
  description: string | null | undefined;
  assignedTo: string | null | undefined;
  estimatedMinutes: number | null | undefined;
  status: string | null | undefined;
  createdAt: string | null | undefined;
  message: string | null | undefined;
}

@Component({
  selector: 'app-automatic-cleaning',
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
  templateUrl: './automatic-cleaning.component.html',
  styleUrls: ['./automatic-cleaning.component.scss']
})
export class AutomaticCleaningComponent {
  protected readonly form: FormGroup;

  protected readonly displayedColumns = [
    'taskId',
    'hotelName',
    'roomCode',
    'description',
    'assignedTo',
    'estimatedMinutes',
    'status',
    'createdAt',
    'message'
  ];

  protected readonly records = signal<CleaningTaskView[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly message = signal<string | null>(null);
  protected readonly hasRecords = computed(() => this.records().length > 0);

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AutomaticCleaningService
  ) {
    this.form = this.fb.group({
      hotelName: ['', Validators.required],
      roomCode: ['', Validators.required],
      newStatus: ['Disponible', Validators.required]
    });
  }

  protected createTask(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as AutomaticCleaningTaskRequest;

    this.loading.set(true);
    this.error.set(null);
    this.message.set(null);

    this.service.create(payload).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.handleResponse(response);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(resolveApiError(error));
      }
    });
  }

  protected trackByTaskId(_: number, task: CleaningTaskView): number | string {
    return task.taskId ?? `${task.hotelName}-${task.roomCode}-${task.createdAt}`;
  }

  protected fieldInvalid(group: FormGroup, field: string): boolean {
    const control = group.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private handleResponse(response: AutomaticCleaningTaskResponse): void {
    if (response.success) {
      const view: CleaningTaskView = {
        taskId: response.taskId,
        hotelName: response.hotelName,
        roomCode: response.roomCode,
        description: response.description,
        assignedTo: response.assignedTo,
        estimatedMinutes: response.estimatedMinutes,
        status: response.status,
        createdAt: response.createdAt,
        message: response.message
      };

      this.records.set([view, ...this.records()]);
      this.message.set(response.message ?? 'Tarea de limpieza generada correctamente.');
    } else {
      this.error.set(
        response.error ?? 'No fue posible generar la tarea automática.'
      );
    }
  }
}
