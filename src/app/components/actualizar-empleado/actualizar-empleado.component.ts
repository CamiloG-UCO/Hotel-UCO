import { Component, OnInit } from '@angular/core';
import { ActualizarEmpleadoService } from '../../services/empleados/actualizar-empleado.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualizar-empleado',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-empleado.component.html',
  styleUrl: './actualizar-empleado.component.scss'
})
export class ActualizarEmpleadoComponent implements OnInit {

  roles: string[] = [];
  empleadoEncontrado: any = null;
  buscarPor: 'id' | 'code' = 'id';
  criterioBusqueda: string = '';

  // Token de autorización
  token: string = '';

  constructor(private actualizarEmpleadoService: ActualizarEmpleadoService) {}

  ngOnInit(): void {
    this.cargarRoles();
    // TODO: Obtener el token del servicio de autenticación
    // this.token = this.authService.getToken();
  }

  cargarRoles(): void {
    this.roles = ['RECEPTIONIST', 'ADMIN', 'CUSTOMER', 'STAFF'];
  }

  buscarEmpleado(): void {
    if (!this.criterioBusqueda.trim()) {
      alert('Por favor ingrese un criterio de búsqueda.');
      return;
    }

    console.log(`🔍 Buscando empleado por ${this.buscarPor}: ${this.criterioBusqueda}`);

    const busqueda$ = this.buscarPor === 'id'
      ? this.actualizarEmpleadoService.obtenerEmpleadoPorId(this.criterioBusqueda)
      : this.actualizarEmpleadoService.obtenerEmpleadoPorCode(this.criterioBusqueda);

    busqueda$.subscribe({
      next: (empleado) => {
        this.empleadoEncontrado = empleado;
        console.log('✅ Empleado encontrado:', empleado);
      },
      error: (err) => {
        console.error('❌ Error al buscar empleado:', err);
        alert('No se encontró el empleado: ' + err);
        this.empleadoEncontrado = null;
      }
    });
  }

  actualizarEmpleado(form: any): void {
    if (form.invalid) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (!this.token) {
      alert('⚠️ Debe estar autenticado como ADMIN para actualizar empleados.');
      return;
    }

    const datosActualizados = {
      name: form.value.name,
      contactNumber: form.value.contactNumber,
      role: form.value.role,
      salary: parseFloat(form.value.salary)
    };

    console.log('📤 Actualizando empleado:', datosActualizados);

    const actualizar$ = this.buscarPor === 'id'
      ? this.actualizarEmpleadoService.actualizarEmpleadoPorId(
        this.empleadoEncontrado.id,
        datosActualizados,
        this.token
      )
      : this.actualizarEmpleadoService.actualizarEmpleadoPorCode(
        this.empleadoEncontrado.code,
        datosActualizados,
        this.token
      );

    actualizar$.subscribe({
      next: (resp) => {
        alert('✅ Empleado actualizado correctamente');
        this.empleadoEncontrado = resp;
        console.log('Empleado actualizado:', resp);
      },
      error: (err) => {
        console.error('❌ Error al actualizar:', err);
        alert('Error al actualizar empleado: ' + err);
      }
    });
  }

  limpiarBusqueda(): void {
    this.criterioBusqueda = '';
    this.empleadoEncontrado = null;
  }
}
