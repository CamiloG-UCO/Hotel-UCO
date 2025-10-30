import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  roles: any[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', Validators.required]
    });

    this.loadRoles();
  }

  get f() {
    return this.registerForm.controls;
  }

  loadRoles() {
    this.authService.getRoles().subscribe({
      next: (roles) => (this.roles = roles),
      error: () => (this.errorMessage = 'Error al cargar roles')
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    const payload = {
      name: this.f['name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: { id: this.f['role'].value }
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.errorMessage = err.error||'No se pudo registrar el usuario.';
      }
    });
  }
   onLoginClick() {
    this.router.navigate(['/login']);
  }
}
