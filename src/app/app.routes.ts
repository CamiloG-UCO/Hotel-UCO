import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CrearEmpleadoComponent } from './components/crear-empleado/crear-empleado.component';
import { EliminarEmpleadoComponent } from './components/eliminar-empleado/eliminar-empleado.component';

import { CancelReservationComponent } from './components/cancel-reservation/cancel-reservation.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { InventarioListComponent } from './components/inventario-list/inventario-list.component';
import { ProductosComponent } from './components/productos/productos.component';
import { TareasHorariosComponent } from './components/tareas-horarios/tareas-horarios.component';
import { ConsultarEmpleadoComponent } from './components/consultar-empleado/consultar-empleado.component';
import { ReservationsComponent } from './components/reservations/reservations.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'RegistrarEmpleado', component: CrearEmpleadoComponent },
  { path: 'EliminarEmpleado', component:EliminarEmpleadoComponent},

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  //Rutas privadas!!!!
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'cancelarreservas', component: CancelReservationComponent, canActivate: [authGuard] },
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

  { path: 'consultar-empleado',
     component: ConsultarEmpleadoComponent, canActivate: [authGuard] },
  { path: 'reservations', component: ReservationsComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
