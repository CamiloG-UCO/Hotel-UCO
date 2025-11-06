import { Component, OnInit } from '@angular/core';
import { CrearEmpleadoService } from '../../services/empleados/crear-empleado-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-empleado',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-empleado.component.html',
  styleUrl: './crear-empleado.component.scss'
})
export class CrearEmpleadoComponent implements OnInit {

  tiposIdentificacion: any[] = [];
  roles: string[] = [];
  hoteles: string[] = [];

  constructor(private crearEmpleadoService: CrearEmpleadoService) {}

  ngOnInit(): void {
    this.cargarTiposIdentificacion();
    this.cargarRoles();
    this.cargarHoteles();
  }

  cargarTiposIdentificacion(): void {
    console.log('🔍 Consultando tipos de identificación...');
    this.crearEmpleadoService.consultarTiposIdentificacion().subscribe({
      next: (data) => {
        this.tiposIdentificacion = data;
        console.log('✅ Tipos cargados:', this.tiposIdentificacion);
      },
      error: (err) => {
        console.error('❌ Error al cargar tipos:', err);
        alert('Error al cargar tipos de identificación: ' + err);
      }
    });
  }

  cargarRoles(): void {
    this.crearEmpleadoService.consultarRoles().subscribe({
      next: (roles) => (this.roles = roles),
      error: (err) => console.error(err)
    });
  }

  cargarHoteles(): void {
    this.crearEmpleadoService.consultarHoteles().subscribe({
      next: (hoteles) => (this.hoteles = hoteles),
      error: (err) => console.error(err)
    });
  }

  registrarEmpleado(form: any): void {
    if (form.invalid) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    console.log('📤 Enviando empleado:', form.value);

    this.crearEmpleadoService.crearEmpleado(form.value).subscribe({
      next: (resp) => {
        alert('✅ Empleado registrado correctamente');
        form.resetForm();
      },
      error: (err) => {
        console.error('❌ Error al registrar:', err);
        alert('Error al registrar empleado: ' + err);
      }
    });
  }
}
