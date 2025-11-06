import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CrearEmpleadoComponent } from './components/crear-empleado/crear-empleado.component';
import { EliminarEmpleadoComponent } from './components/eliminar-empleado/eliminar-empleado.component';
import { ActualizarEmpleadoComponent } from './components/actualizar-empleado/actualizar-empleado.component';

import { CancelReservationComponent } from './components/cancel-reservation/cancel-reservation.component';
import { ClientListComponent } from './components/clients/client-list/client-list.component';
import { HomeConfiguracionComponent } from './components/configuracion/home-configuracion/home-configuracion.component';
import { HotelListComponent } from './components/configuracion/hotel/hotel-list/hotel-list.component';
import { CrearHotelComponent } from './components/configuracion/hotel/crear-hotel/crear-hotel.component';
import { InventarioListComponent } from './components/inventario-list/inventario-list.component';
import { ProductosComponent } from './components/productos/productos.component';
import { TareasHorariosComponent } from './components/tareas-horarios/tareas-horarios.component';
import { ConsultarEmpleadoComponent } from './components/consultar-empleado/consultar-empleado.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { ClientCreateComponent } from './components/clients/client-create/client-create.component';
import { UpdateClientComponent } from './components/clients/update-client/update-client.component';
import { ActualizarHotelComponent } from './components/configuracion/hotel/actualizar-hotel/actualizar-hotel.component';
import { VerHotelComponent } from './components/configuracion/hotel/ver-hotel/ver-hotel.component';
import { HabitacionListComponent } from './components/configuracion/habitacion/habitacion-list/habitacion-list.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'RegistrarEmpleado', component: CrearEmpleadoComponent },
  { path: 'EliminarEmpleado', component:EliminarEmpleadoComponent},
  { path: 'ActualizarEmpleado', component: ActualizarEmpleadoComponent, canActivate: [authGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  //Rutas privadas!!!!
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'cancelarreservas', component: CancelReservationComponent, canActivate: [authGuard] },
  { path: 'config', component: HomeConfiguracionComponent, canActivate: [authGuard]},
  { path: 'config/habitaciones', component: HabitacionListComponent, canActivate: [authGuard]},
  { path: 'hotel/list', component: HotelListComponent, canActivate: [authGuard]},
  { path: 'hotel/new', component: CrearHotelComponent, canActivate: [authGuard]},
  { path: 'hotel/edit/:id', component: ActualizarHotelComponent, canActivate: [authGuard]},
  { path: 'hotel/view', component: VerHotelComponent, canActivate: [authGuard]},
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'home/clientes',
    component: ClientListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'inventario',
    component: InventarioListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tareas-horarios',
    component: TareasHorariosComponent,
    canActivate: [authGuard]
  },
    {
    path: 'home/clientes/update',
    component: UpdateClientComponent,
    canActivate: [authGuard]
  },

  { path: 'consultar-empleado',
     component: ConsultarEmpleadoComponent, canActivate: [authGuard] },
  { path: 'reservations', component: ReservationsComponent },

  { path: 'clients/create',
     component: ClientCreateComponent,
     canActivate: [authGuard] },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
