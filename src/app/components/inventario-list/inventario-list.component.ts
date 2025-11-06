import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { InventarioService } from '../../services/inventario/inventario.service';
import { ProductoService } from '../../services/inventario/producto.service';
import { Inventario } from '../../models/inventario.model';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-inventario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './inventario-list.component.html',
  styleUrls: ['./inventario-list.component.scss']
})
export class InventarioListComponent implements OnInit {
  inventarios: Inventario[] = [];
  productos: Producto[] = [];
  inventariosBajoStock: Inventario[] = [];
  selectedInventario?: Inventario;
  showBajoStock = false;

  // Formulario de registro
  registroForm = {
    productoId: 0,
    cantidad: 0,
    ubicacion: ''
  };

  // Formulario de actualización
  actualizacionForm = {
    productoId: 0,
    ubicacion: '',
    cantidadNueva: 0
  };

  constructor(
    private readonly inventarioService: InventarioService,
    private readonly productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllInventarios();
    this.loadAllProductos();
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goToProductos(): void {
    this.router.navigate(['/productos']);
  }

  loadAllInventarios(): void {
    this.inventarioService.findAll().subscribe({
      next: (data) => {
        this.inventarios = data;
        this.showBajoStock = false;
      },
      error: (err) => {
        console.error('Error al cargar inventarios:', err);
        Swal.fire('Error', err, 'error');
      }
    });
  }

  loadAllProductos(): void {
    this.productoService.findAll().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  loadBajoStock(): void {
    this.inventarioService.obtenerBajoStock().subscribe({
      next: (data) => {
        this.inventariosBajoStock = data;
        this.showBajoStock = true;
      },
      error: (err) => {
        console.error('Error al cargar bajo stock:', err);
        Swal.fire('Error', err, 'error');
      }
    });
  }

  registrarProducto(): void {
    if (!this.registroForm.productoId || !this.registroForm.cantidad || !this.registroForm.ubicacion) {
      Swal.fire('Advertencia', 'Complete todos los campos del formulario', 'warning');
      return;
    }

    this.inventarioService.registrarProducto(
      this.registroForm.productoId,
      this.registroForm.cantidad,
      this.registroForm.ubicacion
    ).subscribe({
      next: (data) => {
        Swal.fire('Éxito', 'Producto registrado en inventario correctamente', 'success');
        this.loadAllInventarios();
        this.resetRegistroForm();
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
      }
    });
  }

  actualizarStock(): void {
    if (!this.actualizacionForm.productoId || !this.actualizacionForm.ubicacion || !this.actualizacionForm.cantidadNueva) {
      Swal.fire('Advertencia', 'Complete todos los campos del formulario', 'warning');
      return;
    }

    this.inventarioService.actualizarStock(
      this.actualizacionForm.productoId,
      this.actualizacionForm.ubicacion,
      this.actualizacionForm.cantidadNueva
    ).subscribe({
      next: (data) => {
        Swal.fire('Éxito', 'Stock actualizado correctamente', 'success');
        this.loadAllInventarios();
        this.resetActualizacionForm();
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
      }
    });
  }

  selectInventario(inventario: Inventario): void {
    this.selectedInventario = inventario;
  }

  getProductoNombre(productoId: number): string {
    const producto = this.productos.find(p => p.id === productoId);
    return producto ? producto.nombre : 'N/A';
  }

  getStockStatus(inventario: Inventario): string {
    if (inventario.cantidad <= inventario.stockMinimo) {
      return 'bajo-stock';
    } else if (inventario.cantidad <= inventario.stockMinimo * 1.5) {
      return 'medio-stock';
    }
    return 'buen-stock';
  }

  resetRegistroForm(): void {
    this.registroForm = {
      productoId: 0,
      cantidad: 0,
      ubicacion: ''
    };
  }

  resetActualizacionForm(): void {
    this.actualizacionForm = {
      productoId: 0,
      ubicacion: '',
      cantidadNueva: 0
    };
  }
}
