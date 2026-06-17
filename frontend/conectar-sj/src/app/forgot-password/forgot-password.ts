import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '../shared/logger.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPasswordPage {
  private router = inject(Router);
  private http = inject(HttpClient);
  private logger = inject(LoggerService);

  email = '';
  submitted = false;
  error = '';

  onSubmit(): void {
    if (!this.email) {
      this.error = 'Por favor, ingresa tu correo electrónico.';
      return;
    }

    this.submitted = true;

    this.http.post('/auth/forgot-password', { email: this.email }).subscribe({
      error: (err) => this.logger.error('Error al enviar email de recuperación:', err)
    });
  }
}
