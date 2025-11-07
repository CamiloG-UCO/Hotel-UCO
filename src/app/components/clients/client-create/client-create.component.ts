import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ClientFormComponent],
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.scss']
})
export class ClientCreateComponent {
  constructor(private router: Router) {}

  onCreated(): void {
    this.router.navigate(['/home/clientes']);
  }

  onCancel(): void {
    this.router.navigate(['/home/clientes']);
  }
}
