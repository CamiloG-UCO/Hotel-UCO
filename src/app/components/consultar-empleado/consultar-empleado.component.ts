import { Component, OnInit } from '@angular/core';
import { ConsultarEmpleadosService } from '../../services/empleados/consultar/consultar-empleados.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consultar-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private consultarService: ConsultarEmpleadosService) {}

  ngOnInit(): void {
    this.obtenerTodosEmpleados();
  }

  obtenerTodosEmpleados() {
    this.consultarService.getAllEmpleados().subscribe(res => this.empleados = res);
  }

  buscarPorCodigo() {
    if (!this.codigoBuscar) return;
    this.consultarService.getEmpleadoByCode(this.codigoBuscar)
      .subscribe(res => this.empleados = [res], err => this.empleados = []);
  }

  filtrarPorHotel() {
    if (!this.hotelBuscar) {
      this.obtenerTodosEmpleados();
      return;
    }
    this.consultarService.getEmpleadosByHotel(this.hotelBuscar)
      .subscribe(res => this.empleados = res, err => this.empleados = []);
  }
}
