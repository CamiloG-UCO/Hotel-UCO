import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CrearHabitacionPayload,
  ESTADOS_HABITACION,
  HabitacionPage,
  HabitacionResponse,
  TIPOS_HABITACION
} from '../../../../services/configuracion/clases/Habitacion';
import { HabitacionService } from '../../../../services/configuracion/habitacion/habitacion.service';
import { AuthService } from '../../../../services/auth/auth.service';

const DEFAULT_PAGE_SIZE = 10;

type FiltroHabitacion = 'TODAS' | 'ESTADO' | 'HOTEL' | 'TIPO';

@Component({
  selector: 'app-habitacion-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitacion-list.component.html',
  styleUrl: './habitacion-list.component.scss'
})
export class HabitacionListComponent implements OnInit {
  habitaciones: HabitacionResponse[] = [];
  filtroSeleccionado: FiltroHabitacion = 'TODAS';
  estados = ESTADOS_HABITACION;
  tipos = TIPOS_HABITACION;

  page = 0;
  size = DEFAULT_PAGE_SIZE;
  totalElementos = 0;
  totalPaginas = 0;
  numeroElementos = 0;
  estaCargando = false;
  mensajeError = '';
  mensajeExito = '';

  estadoSeleccionado: HabitacionResponse['estado'] | '' = '';
  hotelCodigo = '';
  tipoSeleccionado = '';

  mostrarModalCrear = false;
  creandoHabitacion = false;
  nuevaHabitacion: CrearHabitacionPayload = {
    habitacionId: '',
    nombre: '',
    tipo: this.tipos[0],
    capacidad: 1,
    hotelCodigo: ''
  };

  constructor(
    private readonly habitacionService: HabitacionService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.buscarHabitaciones();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  volverAConfiguracion(): void {
    this.router.navigate(['/config']);
  }

  cambiarFiltro(filtro: FiltroHabitacion): void {
    if (this.filtroSeleccionado === filtro) {
      return;
    }

    this.filtroSeleccionado = filtro;
    this.estadoSeleccionado = '';
    this.hotelCodigo = '';
    this.tipoSeleccionado = '';
    this.page = 0;
    this.size = DEFAULT_PAGE_SIZE;
    this.buscarHabitaciones();
  }

  buscarHabitaciones(): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.estaCargando = true;

    switch (this.filtroSeleccionado) {
      case 'TODAS':
        this.obtenerHabitacionesPaginadas();
        break;
      case 'ESTADO':
        if (!this.estadoSeleccionado) {
          this.finalizarCargaConError('Selecciona un estado para continuar.');
          return;
        }
        this.habitacionService.listarPorEstado(this.estadoSeleccionado).subscribe({
          next: (habitaciones) => {
            this.asignarHabitaciones(habitaciones, {
              totalElements: habitaciones.length,
              totalPages: 1,
              numberOfElements: habitaciones.length
            });
          },
          error: (error) => this.finalizarCargaConError(error?.error || 'No fue posible cargar las habitaciones por estado.')
        });
        break;
      case 'HOTEL':
        if (!this.hotelCodigo.trim()) {
          this.finalizarCargaConError('Ingresa el código del hotel.');
          return;
        }
        this.habitacionService.listarPorHotel(this.hotelCodigo.trim()).subscribe({
          next: (habitaciones) => {
            this.asignarHabitaciones(habitaciones, {
              totalElements: habitaciones.length,
              totalPages: 1,
              numberOfElements: habitaciones.length
            });
          },
          error: (error) => this.finalizarCargaConError(error?.error || 'No fue posible cargar las habitaciones por hotel.')
        });
        break;
      case 'TIPO':
        if (!this.tipoSeleccionado) {
          this.finalizarCargaConError('Selecciona un tipo para continuar.');
          return;
        }
        this.habitacionService.listarPorTipo(this.tipoSeleccionado).subscribe({
          next: (habitaciones) => {
            this.asignarHabitaciones(habitaciones, {
              totalElements: habitaciones.length,
              totalPages: 1,
              numberOfElements: habitaciones.length
            });
          },
          error: (error) => this.finalizarCargaConError(error?.error || 'No fue posible cargar las habitaciones por tipo.')
        });
        break;
    }
  }

  paginaAnterior(): void {
    if (this.page === 0 || this.filtroSeleccionado !== 'TODAS') {
      return;
    }
    this.page -= 1;
    this.buscarHabitaciones();
  }

  paginaSiguiente(): void {
    if (this.filtroSeleccionado !== 'TODAS' || this.page + 1 >= this.totalPaginas) {
      return;
    }
    this.page += 1;
    this.buscarHabitaciones();
  }

  abrirModalCrear(): void {
    this.resetFormularioCreacion();
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    if (this.creandoHabitacion) {
      return;
    }
    this.mostrarModalCrear = false;
  }

  crearHabitacion(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.nuevaHabitacion.habitacionId.trim() ||
        !this.nuevaHabitacion.nombre.trim() ||
        !this.nuevaHabitacion.hotelCodigo.trim()) {
      this.mensajeError = 'Completa los campos obligatorios para crear la habitación.';
      return;
    }

    if (this.nuevaHabitacion.capacidad < 1) {
      this.mensajeError = 'La capacidad debe ser mayor o igual a 1.';
      return;
    }

    this.creandoHabitacion = true;

    this.habitacionService.crearHabitacion({
      habitacionId: this.nuevaHabitacion.habitacionId.trim(),
      nombre: this.nuevaHabitacion.nombre.trim(),
      tipo: this.nuevaHabitacion.tipo,
      capacidad: this.nuevaHabitacion.capacidad,
      hotelCodigo: this.nuevaHabitacion.hotelCodigo.trim()
    }).subscribe({
      next: (mensaje) => {
        this.mensajeExito = mensaje || 'Habitación creada correctamente.';
        this.creandoHabitacion = false;
        this.mostrarModalCrear = false;
        this.buscarHabitaciones();
      },
      error: (error) => {
        this.creandoHabitacion = false;
        this.mensajeError = error?.error || 'No fue posible crear la habitación.';
      }
    });
  }

  private obtenerHabitacionesPaginadas(): void {
    this.habitacionService.listarHabitacionesPaginadas(this.page, this.size).subscribe({
      next: (pagina) => {
        this.asignarHabitacionesDesdePagina(pagina);
      },
      error: (error) => this.finalizarCargaConError(error?.error || 'No fue posible cargar las habitaciones.')
    });
  }

  private asignarHabitacionesDesdePagina(pagina: HabitacionPage): void {
    this.asignarHabitaciones(pagina.content, {
      totalElements: pagina.totalElements,
      totalPages: pagina.totalPages,
      numberOfElements: pagina.numberOfElements
    });
  }

  private asignarHabitaciones(habitaciones: HabitacionResponse[], metadata: {
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
  }): void {
    this.habitaciones = habitaciones;
    this.totalElementos = metadata.totalElements;
    this.totalPaginas = metadata.totalPages;
    this.numeroElementos = metadata.numberOfElements;
    this.estaCargando = false;
  }

  private finalizarCargaConError(mensaje: string): void {
    this.estaCargando = false;
    this.habitaciones = [];
    this.totalElementos = 0;
    this.totalPaginas = 0;
    this.numeroElementos = 0;
    this.mensajeError = mensaje;
  }

  private resetFormularioCreacion(): void {
    this.nuevaHabitacion = {
      habitacionId: '',
      nombre: '',
      tipo: this.tipos[0],
      capacidad: 1,
      hotelCodigo: ''
    };
    this.creandoHabitacion = false;
  }
}
