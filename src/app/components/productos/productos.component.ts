import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/inventario/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  selectedProducto?: Producto;
  isEditing = false;

  productoForm: Producto = {
    codigo: '',
    nombre: '',
    categoria: '',
    tipo: '',
    unidad: '',
    barcode: ''
  };

  constructor(
    private readonly productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllProductos();
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goToInventario(): void {
    this.router.navigate(['/inventario']);
  }

  loadAllProductos(): void {
    this.productoService.findAll().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        Swal.fire('Error', err, 'error');
      }
    });
  }

  selectProducto(producto: Producto): void {
    this.selectedProducto = producto;
  }

  editProducto(producto: Producto): void {
    this.isEditing = true;
    this.productoForm = { ...producto };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  createProducto(): void {
    if (!this.validateForm()) {
      return;
    }

    this.productoService.create(this.productoForm).subscribe({
      next: (data) => {
        Swal.fire('Éxito', 'Producto creado correctamente', 'success');
        this.loadAllProductos();
        this.resetForm();
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
      }
    });
  }

  updateProducto(): void {
    if (!this.productoForm.id) {
      return;
    }

    const updateData = {
      nombre: this.productoForm.nombre,
      categoria: this.productoForm.categoria
    };

    this.productoService.update(this.productoForm.id, updateData).subscribe({
      next: (data) => {
        Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
        this.loadAllProductos();
        this.resetForm();
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
      }
    });
  }

  deleteProducto(id: number, nombre: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el producto "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
            this.loadAllProductos();
            if (this.selectedProducto?.id === id) {
              this.selectedProducto = undefined;
            }
          },
          error: (err) => {
            Swal.fire('Error', err, 'error');
          }
        });
      }
    });
  }

  validateForm(): boolean {
    if (!this.productoForm.codigo || !this.productoForm.nombre ||
        !this.productoForm.categoria || !this.productoForm.tipo ||
        !this.productoForm.unidad || !this.productoForm.barcode) {
      Swal.fire('Advertencia', 'Complete todos los campos del formulario', 'warning');
      return false;
    }
    return true;
  }

  resetForm(): void {
    this.productoForm = {
      codigo: '',
      nombre: '',
      categoria: '',
      tipo: '',
      unidad: '',
      barcode: ''
    };
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.resetForm();
  }
}
