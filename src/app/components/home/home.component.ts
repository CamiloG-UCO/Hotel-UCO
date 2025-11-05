import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CancelReservationComponent } from '../cancel-reservation/cancel-reservation.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CancelReservationComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showCancelReservation: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openCancelReservation(): void {
    this.showCancelReservation = true;
  }

  closeCancelReservation(): void {
    this.showCancelReservation = false;
  }
}
