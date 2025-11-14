import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EliminarEmpleadoService } from '../../services/empleados/eliminar-empleado-service';

@Component({
  selector: 'app-eliminar-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eliminar-empleado.component.html',
  styleUrls: ['./eliminar-empleado.component.scss']
})
export class EliminarEmpleadoComponent {

  codigoEmpleado: string = '';   // Código del empleado
  empleado: any = null;
  cargando: boolean = false;
  encontrado: boolean = false;

  constructor(private eliminarEmpleadoService: EliminarEmpleadoService) {}

  buscarEmpleado(): void {

    if (!this.codigoEmpleado.trim()) {
      alert('Por favor ingrese el código del empleado');
      return;
    }

    this.cargando = true;

    this.eliminarEmpleadoService.obtenerEmpleadoPorCodigo(this.codigoEmpleado).subscribe({
      next: (data: any) => {
        this.empleado = data;
        this.encontrado = true;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('❌ Error al buscar empleado:', err);
        alert(err.error?.error || 'No se encontró ningún empleado con ese código');
        this.cargando = false;
        this.encontrado = false;
      }
    });
  }

  eliminarEmpleado(): void {

    if (!confirm('¿Está seguro de eliminar este empleado? Esta acción no se puede deshacer.')) {
      return;
    }

    this.cargando = true;

    this.eliminarEmpleadoService.eliminarEmpleado(this.codigoEmpleado).subscribe({
      next: (resp: any) => {
        alert(resp.message || 'Empleado eliminado correctamente');
        this.codigoEmpleado = '';
        this.empleado = null;
        this.encontrado = false;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('❌ Error al eliminar:', err);
        alert(err.error?.error || 'Error al eliminar empleado');
        this.cargando = false;
      }
    });
  }
}