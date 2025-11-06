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

  idEmpleado = '';
  empleado: any = null;
  cargando = false;
  encontrado = false;

  constructor(private eliminarEmpleadoService: EliminarEmpleadoService) {}

  buscarEmpleado(): void {
    if (!this.idEmpleado.trim()) {
      alert('Por favor ingrese un ID o número de empleado');
      return;
    }

    this.cargando = true;
    this.eliminarEmpleadoService.obtenerEmpleadoPorId(this.idEmpleado).subscribe({
      next: (data) => {
        this.empleado = data;
        this.encontrado = true;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al buscar empleado:', err);
        alert('No se encontró ningún empleado con ese ID');
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
    this.eliminarEmpleadoService.eliminarEmpleado(this.idEmpleado).subscribe({
      next: () => {
        alert('✅ Empleado eliminado correctamente');
        this.idEmpleado = '';
        this.empleado = null;
        this.encontrado = false;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al eliminar:', err);
        alert('Error al eliminar empleado: ' + err.message);
        this.cargando = false;
      }
    });
  }
}
