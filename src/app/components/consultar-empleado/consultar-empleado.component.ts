import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ConsultarEmpleadosService } from '../../services/empleados/consultar/consultar-empleados.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';


@Component({
  selector: 'app-consultar-empleado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './consultar-empleado.component.html',
  styleUrls: ['./consultar-empleado.component.scss']
})
export class ConsultarEmpleadoComponent implements OnInit {

  empleados: any[] = [];
  codigoBuscar: string = '';
  hotelBuscar: string = '';
  hoteles: string[] = [
    'Santa Marta Resort',
    'Hotel Caribe Deluxe',
    'Hotel Andino Plaza',
    'Medellín Sky Suites'
  ];

  displayedColumns: string[] = ['code', 'name', 'email', 'roles', 'hotel', 'salary'];

  constructor(private consultarService: ConsultarEmpleadosService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerTodosEmpleados();
  }

  obtenerTodosEmpleados() {
    this.consultarService.getAllEmpleados().subscribe(res => this.empleados = res);
  }

  buscarPorCodigo() {
    if (!this.codigoBuscar.trim()) {
      this.obtenerTodosEmpleados();
      return;
    }
    this.consultarService.getEmpleadoByCode(this.codigoBuscar)
      .subscribe(
        res => this.empleados = [res],
        () => this.empleados = []
      );
  }

  filtrarPorHotel() {
    if (!this.hotelBuscar) {
      this.obtenerTodosEmpleados();
      return;
    }
    this.consultarService.getEmpleadosByHotel(this.hotelBuscar)
      .subscribe(
        res => this.empleados = res,
        () => this.empleados = []
      );
  }

  // Métodos para redirigir
  irRegistrarEmpleado() {
    this.router.navigate(['/RegistrarEmpleado']);
  }

  irActualizarEmpleado() {
    this.router.navigate(['/ActualizarEmpleado']); // Asegúrate de tener esta ruta
  }

  irEliminarEmpleado() {
    this.router.navigate(['/EliminarEmpleado']); // Asegúrate de tener esta ruta
  }
  
  irHome() {
  this.router.navigate(['/home']);
}

}
