import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CrearEmpleadoComponent } from './components/crear-empleado/crear-empleado.component';

import { CancelReservationComponent } from './components/cancel-reservation/cancel-reservation.component';
import { ClientListComponent } from './components/client-list/client-list.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  //Rutas privadas!!!!
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'cancelarreservas', component: CancelReservationComponent, canActivate: [authGuard] },
    { path: 'RegistrarEmpleado', component: CrearEmpleadoComponent,  canActivate: [authGuard] },

  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [authGuard]
  },
  {
    path: 'home/clientes', 
    component: ClientListComponent, 
    canActivate: [authGuard]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
