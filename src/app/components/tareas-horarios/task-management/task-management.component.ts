import { CommonModule } from '@angular/common';
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
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import {
  TaskManagementService,
  TaskPayload,
  TaskResponse,
  TaskStatus
} from '../../../services/tareas-horarios/task-management.service';
import { resolveApiError } from '../../../services/tareas-horarios/api-error.util';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatProgressBarModule,
    MatDividerModule
  ],
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss']
})
export class TaskManagementComponent implements OnInit {
  private readonly statusDefaults: TaskStatus[] = [
    'Pendiente',
    'En progreso',
    'Completada'
  ];

  protected readonly form: FormGroup;

  protected readonly displayedColumns = [
    'taskId',
    'description',
    'assignedEmployee',
    'status',
    'startTime',
    'endTime',
    'actions'
  ];

  protected readonly statusOptions = [...this.statusDefaults];

  protected readonly tasks = signal<TaskResponse[]>([]);
  protected readonly taskLoading = signal(false);
  protected readonly taskError = signal<string | null>(null);

  protected readonly creationLoading = signal(false);
  protected readonly creationError = signal<string | null>(null);
  protected readonly creationMessage = signal<string | null>(null);

  protected readonly updateLoading = signal<string | null>(null);
  protected readonly updateError = signal<string | null>(null);
  protected readonly updateMessage = signal<string | null>(null);

  protected readonly statusSelections = signal<Partial<Record<string, TaskStatus>>>({});
  protected readonly hasTasks = computed(() => this.tasks().length > 0);

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: TaskManagementService
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      assignedEmployee: ['', Validators.required],
      status: [this.statusDefaults[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  protected loadTasks(): void {
    this.taskLoading.set(true);
    this.taskError.set(null);
    this.updateMessage.set(null);
    this.updateError.set(null);

    this.service.getAll().subscribe({
      next: (response) => {
        const data = response ?? [];
        this.tasks.set(data);
        this.statusSelections.set(this.buildStatusSelections(data));
        this.taskLoading.set(false);
      },
      error: (error) => {
        this.tasks.set([]);
        this.statusSelections.set({});
        this.taskLoading.set(false);
        this.taskError.set(resolveApiError(error));
      }
    });
  }

  protected createTask(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as TaskPayload;

    this.creationLoading.set(true);
    this.creationError.set(null);
    this.creationMessage.set(null);
    this.updateMessage.set(null);
    this.updateError.set(null);

    this.service.create(payload).subscribe({
      next: (response) => {
        this.creationLoading.set(false);
        this.creationMessage.set('Tarea creada correctamente.');
        this.form.reset({
          description: '',
          assignedEmployee: '',
          status: this.statusDefaults[0]
        });
        const updated = [response, ...this.tasks()];
        this.tasks.set(updated);
        this.statusSelections.set(this.buildStatusSelections(updated));
      },
      error: (error) => {
        this.creationLoading.set(false);
        this.creationError.set(resolveApiError(error));
      }
    });
  }

  protected onStatusSelect(taskId: string, value: TaskStatus): void {
    const current = { ...this.statusSelections() };
    current[taskId] = value;
    this.statusSelections.set(current);
    this.updateMessage.set(null);
    this.updateError.set(null);
  }

  protected shouldEnableUpdate(taskId: string, currentStatus: TaskStatus): boolean {
    const selected = this.statusSelections()[taskId] ?? currentStatus;
    return selected !== currentStatus;
  }

  protected updateTaskStatus(task: TaskResponse): void {
    const targetStatus = this.statusSelections()[task.taskId] ?? task.status;
    if (!targetStatus || targetStatus === task.status) {
      return;
    }

    const payload: TaskResponse = {
      ...task,
      status: targetStatus
    };

    this.updateLoading.set(task.taskId);
    this.updateError.set(null);
    this.updateMessage.set(null);

    this.service.update(task.taskId, payload).subscribe({
      next: (response) => {
        this.updateLoading.set(null);
        this.updateMessage.set('Estado actualizado correctamente.');
        const updatedTasks = this.tasks().map((item) =>
          item.taskId === response.taskId ? { ...item, ...response } : item
        );
        this.tasks.set(updatedTasks);
        this.statusSelections.set(this.buildStatusSelections(updatedTasks));
      },
      error: (error) => {
        this.updateLoading.set(null);
        this.updateError.set(resolveApiError(error));
      }
    });
  }

  protected trackByTaskId(_: number, task: TaskResponse): string {
    return task.taskId;
  }

  protected fieldInvalid(group: FormGroup, field: string): boolean {
    const control = group.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private buildStatusSelections(tasks: TaskResponse[]): Partial<Record<string, TaskStatus>> {
    return tasks.reduce((acc, item) => {
      acc[item.taskId] = item.status;
      return acc;
    }, {} as Partial<Record<string, TaskStatus>>);
  }
}
