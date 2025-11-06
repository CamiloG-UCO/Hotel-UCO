import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateclientService } from '../../services/clientes/updateclient.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-update-client',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss']
})
export class UpdateClientComponent implements OnInit {

  updateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private updateClientService: UpdateclientService,
    private router: Router,
    private clientService: ClientService,
  ) {
    this.updateForm = this.fb.group({
      id: [''],
      clientCode: [''],
      documentType: ['', Validators.required],
      documentNumber:['', Validators.required],
      name: ['', Validators.required],
      lastNames: ['', Validators.required], 
      email: ['', Validators.required], 
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  const client = this.clientService.getSelectedClient();
  console.log('Cliente recibido:', client);

  if (client) {
    this.updateForm.patchValue(client);
  } else {
    this.snackBar.open('No se encontraron los datos del cliente.', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    this.router.navigate(['/home/clientes']);
  }
  }

  updateClient() {
    if (this.updateForm.valid) {
      const formData = this.updateForm.value;

      this.updateClientService.updateClient(formData).subscribe(
        resp => {
          this.snackBar.open('Cliente actualizado correctamente', '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          setTimeout(() => this.router.navigate(['/home/clientes']), 2000);
        },
        error => {
          console.error(error);
          this.snackBar.open('Error al actualizar el cliente', '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      );
    } else {
      this.snackBar.open('Formulario inválido. Por favor completa todos los campos.', '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
}
