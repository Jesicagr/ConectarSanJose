import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../shared/logger.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private logger = inject(LoggerService);

  showPassword = false;

  loginForm = {
    email: '',
    password: '',
    rememberMe: false
  };

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.loginForm.email = savedEmail;
      this.loginForm.rememberMe = true;
    }
  }

  onLogin(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      alert('Por favor, ingresa tus credenciales.');
      return;
    }

    const credentials = {
      email: this.loginForm.email, 
      password: this.loginForm.password
    };

    this.http.post<{ token: string }>('/auth/login', credentials).subscribe({
      next: (response) => {
        this.auth.setToken(response.token);

        if (this.loginForm.rememberMe) {
          localStorage.setItem('savedEmail', this.loginForm.email);
        } else {
          localStorage.removeItem('savedEmail');
        }

        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.logger.error('Error en la autenticación:', err);
        if (err.status === 401) {
          alert('Usuario o contraseña incorrectos.');
        } else {
          alert('Hubo un problema de conexión con el backend o permisos (Código: ' + err.status + ').');
        }
      }
    });
  }
}