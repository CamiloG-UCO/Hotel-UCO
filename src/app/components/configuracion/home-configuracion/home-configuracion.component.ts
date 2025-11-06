import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-configuracion',
  imports: [],
  templateUrl: './home-configuracion.component.html',
  styleUrl: './home-configuracion.component.scss'
})
export class HomeConfiguracionComponent {
    constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToHotelList() {
    this.router.navigate(['/hotel/list']);
  } 

  goToHome(){
    this.router.navigate(["/home"]);
  }

}
