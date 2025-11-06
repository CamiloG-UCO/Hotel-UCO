import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagementComponent } from './task-management/task-management.component';
import { AutomaticCleaningComponent } from './automatic-cleaning/automatic-cleaning.component';
import { AttendanceControlComponent } from './attendance-control/attendance-control.component';
import { ShiftSchedulerComponent } from './shift-scheduler/shift-scheduler.component';
import { Router } from '@angular/router';

export type TareasHorariosView = 'tasks' | 'cleaning' | 'attendance' | 'scheduler';

@Component({
  selector: 'app-tareas-horarios',
  standalone: true,
  imports: [
    CommonModule,
    TaskManagementComponent,
    AutomaticCleaningComponent,
    AttendanceControlComponent,
    ShiftSchedulerComponent
  ],
  templateUrl: './tareas-horarios.component.html',
  styleUrls: ['./tareas-horarios.component.scss']
})
export class TareasHorariosComponent {
  private readonly router = inject(Router);

  private readonly views: Record<TareasHorariosView, string> = {
    tasks: 'Gestión de tareas',
    cleaning: 'Limpieza automática',
    attendance: 'Control de asistencia',
    scheduler: 'Agendar turnos'
  };

  protected readonly options = (Object.entries(this.views) as Array<[
    TareasHorariosView,
    string
  ]>).map(([key, label]) => ({ key, label }));

  protected readonly selectedView = signal<TareasHorariosView>('tasks');
  protected readonly selectedLabel = computed(() => this.views[this.selectedView()]);

  protected select(view: TareasHorariosView): void {
    this.selectedView.set(view);
  }

  protected goHome(): void {
    this.router.navigate(['/home']);
  }
}
