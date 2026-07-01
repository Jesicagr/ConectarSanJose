import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

export interface TelefonoItem {
  numero: string;
  esWhatsapp: boolean;
  etiqueta?: string;
}

export interface Area {
  id: number;
  nombre: string;
  icono: string;
  descripcion: string;
  telefono: string;
  esWhatsapp?: boolean;
  telefonoEtiqueta?: string;
  referente?: string;
  direccion?: string;
  email?: string;
  redes?: string;
  sitioWeb?: string;
  horarioAtencion?: string;
  telefonos?: TelefonoItem[];
}

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private http = inject(HttpClient);
  private apiUrl = '/api/areas';
  private cache$: Observable<Area[]> | null = null;
  private detailCache = new Map<number, Observable<Area>>();

  obtenerTodas(): Observable<Area[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<Area[]>(this.apiUrl).pipe(shareReplay(1));
    }
    return this.cache$;
  }

  obtenerPorId(id: number): Observable<Area> {
    if (!this.detailCache.has(id)) {
      this.detailCache.set(id, this.http.get<Area>(`${this.apiUrl}/${id}`).pipe(shareReplay(1)));
    }
    return this.detailCache.get(id)!;
  }

  crear(area: Partial<Area>): Observable<Area> {
    this.invalidateCache();
    return this.http.post<Area>(this.apiUrl, area);
  }

  actualizar(id: number, area: Partial<Area>): Observable<Area> {
    this.invalidateCache();
    return this.http.put<Area>(`${this.apiUrl}/${id}`, area);
  }

  eliminar(id: number): Observable<void> {
    this.invalidateCache();
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private invalidateCache(): void {
    this.cache$ = null;
  }
}
