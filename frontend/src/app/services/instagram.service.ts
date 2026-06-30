import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

export interface InstagramPost {
  id: number;
  username: string;
  imageUrl: string;
  caption: string;
  postUrl: string;
  postTimestamp: string;
  fetchedAt: string;
  shortcode: string;
}

export interface CuentaInstagram {
  id: number;
  username: string;
  activo: boolean;
  orden: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class InstagramService {
  private http = inject(HttpClient);
  private apiUrl = '/api/instagram';

  obtenerPosts(): Observable<InstagramPost[]> {
    return this.http.get<InstagramPost[]>(`${this.apiUrl}/posts`);
  }

  obtenerPostsPorUsuario(username: string): Observable<InstagramPost[]> {
    return this.http.get<InstagramPost[]>(`${this.apiUrl}/posts/${username}`);
  }

  /* ── Admin: cuentas ── */
  obtenerCuentas(): Observable<CuentaInstagram[]> {
    return this.http.get<CuentaInstagram[]>(`${this.apiUrl}/cuentas`);
  }

  agregarCuenta(username: string): Observable<CuentaInstagram> {
    return this.http.post<CuentaInstagram>(`${this.apiUrl}/cuentas`, { username });
  }

  eliminarCuenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cuentas/${id}`);
  }

  actualizarCuenta(id: number, username?: string, activo?: boolean): Observable<CuentaInstagram> {
    const body: any = {};
    if (username !== undefined) body.username = username;
    if (activo !== undefined) body.activo = activo;
    return this.http.put<CuentaInstagram>(`${this.apiUrl}/cuentas/${id}`, body);
  }

  refrescarCuenta(username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cuentas/${username}/refrescar`, {});
  }

  refrescarTodas(): Observable<any> {
    return this.http.post(`${this.apiUrl}/cuentas/refrescar`, {});
  }
}
