import { Component, inject, OnInit, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.css'
})
export class RecuperarPasswordPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private appRef = inject(ApplicationRef);

  token = '';
  password = '';
  confirmPassword = '';
  loading = false;
  success = false;
  error = '';

  showPassword = false;
  showConfirm = false;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.error = 'El enlace de recuperación no es válido o está incompleto.';
    }
  }

  onSubmit(): void {
    if (!this.password || !this.confirmPassword) {
      this.error = 'Completá ambos campos.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.post('/auth/reset-password', {
      token: this.token,
      password: this.password
    }).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.appRef.tick();
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 400) {
          this.error = 'El enlace es inválido o ya expiró. Solicita uno nuevo.';
        } else {
          this.error = 'Error de conexión con el servidor. Intentalo de nuevo.';
        }
        this.appRef.tick();
      }
    });
  }
}
