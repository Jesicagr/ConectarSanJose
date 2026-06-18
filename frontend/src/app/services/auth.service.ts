import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthUser {
  email: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: AuthUser | null = null;

  constructor(private router: Router) {
    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodeToken(token);
    }
  }

  private decodeToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.user = { email: payload.sub, rol: payload.rol || 'ADMIN' };
    } catch {
      this.clear();
    }
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.decodeToken(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  getRol(): string | null {
    return this.user?.rol ?? null;
  }

  isSuperAdmin(): boolean {
    return this.user?.rol === 'SUPER_ADMIN';
  }

  clear(): void {
    this.user = null;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
