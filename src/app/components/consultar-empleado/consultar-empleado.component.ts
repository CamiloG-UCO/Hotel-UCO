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
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';



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
  hoteles: string[] = [];

  displayedColumns: string[] = ['code', 'name', 'email', 'roles', 'hotel', 'salary'];

  private readonly hotelesUrl = 'http://localhost:8081/api/v1/hotel/all';


  constructor(private consultarService: ConsultarEmpleadosService,
     private router: Router,
     private http: HttpClient
    ) {}

  ngOnInit(): void {
    this.obtenerTodosEmpleados();
    this.obtenerHoteles();
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

  filtrarPorHotel(): void {
    if (!this.hotelBuscar) {
      this.obtenerTodosEmpleados();
      return;
    }
    this.consultarService.getEmpleadosByHotel(this.hotelBuscar).subscribe({
      next: res => this.empleados = res,
      error: () => this.empleados = []
    });
  }

  obtenerHoteles(): void {
    this.consultarHoteles().subscribe({
      next: res => this.hoteles = res,
      error: err => console.error('Error al obtener hoteles:', err)
    });
  }

  consultarHoteles(): Observable<string[]> {
    return this.http.get<any[]>(this.hotelesUrl).pipe(
      map(hoteles =>
        (hoteles || [])
          .map(h => h?.nombre)
          .filter((n: any): n is string => typeof n === 'string' && n.trim().length > 0)
      ),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error HTTP hoteles:', error);
    return throwError(() => 'Error al obtener hoteles');
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

}import { Injectable } from '@angular/core';