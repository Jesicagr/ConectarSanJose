import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

export interface TelefonoItem {
  numero: string;
  esWhatsapp: boolean;
}

export interface Contacto {
  id: number;
  nombreInstitucion: string;
  telefonos: TelefonoItem[];
  descripcion: string;
  icono: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private http = inject(HttpClient);
  private apiUrl = '/api/contactos';
  private cache$: Observable<Contacto[]> | null = null;

  obtenerTodos(): Observable<Contacto[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<Contacto[]>(this.apiUrl).pipe(shareReplay(1));
    }
    return this.cache$;
  }

  crear(contacto: Partial<Contacto>): Observable<Contacto> {
    this.invalidateCache();
    return this.http.post<Contacto>(this.apiUrl, contacto);
  }

  actualizar(id: number, contacto: Partial<Contacto>): Observable<Contacto> {
    this.invalidateCache();
    return this.http.put<Contacto>(`${this.apiUrl}/${id}`, contacto);
  }

  eliminar(id: number): Observable<void> {
    this.invalidateCache();
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private invalidateCache(): void {
    this.cache$ = null;
  }
}
