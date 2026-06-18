import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

interface Usuario {
  id: number;
  email: string;
  rol: string;
}

@Component({
  selector: 'app-usuarios-page',
  imports: [FormsModule],
  templateUrl: './usuarios-page.html',
  styleUrl: './usuarios-page.css',
})
export class UsuariosPage implements OnInit {
  private http = inject(HttpClient);
  auth = inject(AuthService);

  usuarios: Usuario[] = [];
  loading = true;
  error = '';

  form = { email: '', password: '', rol: 'ADMIN' };
  submitting = false;
  mensaje = '';

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
    this.loading = true;
    this.http.get<Usuario[]>('/api/usuarios').subscribe({
      next: (data) => {
        this.usuarios = data.map(u => ({ ...u }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  crearUsuario(): void {
    if (!this.form.email || !this.form.password) return;
    this.submitting = true;
    this.mensaje = '';

    this.http.post<Usuario>('/api/usuarios', this.form).subscribe({
      next: () => {
        this.mensaje = 'Usuario creado correctamente';
        this.form = { email: '', password: '', rol: 'ADMIN' };
        this.submitting = false;
        this.cargarUsuarios();
      },
      error: (err) => {
        this.mensaje = err.error?.error || 'Error al crear usuario';
        this.submitting = false;
      }
    });
  }

  eliminarUsuario(id: number, email: string): void {
    if (!confirm(`¿Eliminar al usuario "${email}"?`)) return;
    this.http.delete(`/api/usuarios/${id}`).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => this.mensaje = 'Error al eliminar usuario'
    });
  }
}
