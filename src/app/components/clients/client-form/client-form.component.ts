// src/app/components/clients/client-form/client-form.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ClientsCommandService } from '../../../services/clients/clients.command.service';
import { CreateClientDto } from '../../../models/create-client.dto'; // deja tu ruta actual
import { Router } from '@angular/router';

type DocType = 'CC' | 'CE' | 'TI' | 'NIT';

type ClientFormGroup = FormGroup<{
  documentType: FormControl<DocType>;
  documentNumber: FormControl<string>;
  name: FormControl<string>;
  lastNames: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
}>;

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent {
  @Output() created = new EventEmitter<void>();
  @Output() cancel  = new EventEmitter<void>();

  loading = false;
  errorMsg = '';
  successMsg = '';
  submitted = false;
  documentTypes: DocType[] = ['CC', 'CE', 'TI', 'NIT'];

  form: ClientFormGroup;

  constructor(private fb: FormBuilder, private cmd: ClientsCommandService, private router: Router) {
    this.form = new FormGroup({
      documentType: new FormControl<DocType>('CC', { nonNullable: true, validators: [Validators.required] }),
      documentNumber: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+$/)] }),
      name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      lastNames: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      phone: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+$/)] }),
    });
  }

  get f() { return this.form.controls; }
  hasErr(ctrl: keyof ClientFormGroup['controls'], key: string) {
    const c = this.f[ctrl] as any;
    return (c.touched || this.submitted) && c.errors?.[key];
  }

  save(): void {
    this.errorMsg = '';
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsg = 'Completa los campos obligatorios.';
      return;
    }

    // Ahora documentType es del tipo union correcto (DocType)
    const dto: CreateClientDto = this.form.getRawValue();
    this.loading = true;

    this.cmd.create(dto)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.created.emit();
          this.successMsg = 'Cliente creado exitosamente.';
          // Mantén el tipo en el reset (documentType como DocType)
          this.form.reset({
            documentType: 'CC' as DocType,
            documentNumber: '',
            name: '',
            lastNames: '',
            email: '',
            phone: ''
          });

          setTimeout(() => {
            this.router.navigate(['/home/clientes']);
          }, 2000);
        },
        error: (e: Error) => {
          this.errorMsg = e.message || 'Error al crear el cliente';
        }
      });
  }
}
