import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

export interface HorarioSede {
  id?: number;
  diaDesde: string | null;
  diaHasta: string | null;
  horaInicio: string;
  horaFin: string;
}

export interface Sede {
  id?: number;
  nombre: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  icono?: string;
  esWhatsapp?: boolean;
  latitud?: number | null;
  longitud?: number | null;
  horarios?: HorarioSede[];
}

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private http = inject(HttpClient);
  private apiUrl = '/api/sedes';
  private cache$: Observable<Sede[]> | null = null;

  obtenerTodas(): Observable<Sede[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<Sede[]>(this.apiUrl).pipe(shareReplay(1));
    }
    return this.cache$;
  }

  crear(payload: Partial<Sede>): Observable<Sede> {
    this.invalidateCache();
    return this.http.post<Sede>(this.apiUrl, payload);
  }

  actualizar(id: number, payload: Partial<Sede>): Observable<Sede> {
    this.invalidateCache();
    return this.http.put<Sede>(`${this.apiUrl}/${id}`, payload);
  }

  eliminar(id: number): Observable<void> {
    this.invalidateCache();
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private invalidateCache(): void {
    this.cache$ = null;
  }
}