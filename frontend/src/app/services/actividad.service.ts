import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

export interface ActividadPayload {
  titulo: string;
  descripcion: string;
  sede: { id: number };
  fechaInicio: string;
  fechaFin: string | null;
  repetirTodoAnio: boolean;
  areas: { id: number }[];
  horarios: { diaSemana: string; horaInicio: string; horaFin?: string | null }[];
  descripcion_corta?: string;
  encargado?: string;
  telefono?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private http = inject(HttpClient);
  private apiUrl = '/api/actividades';
  private areaActivitiesCache = new Map<number, Observable<any[]>>();

  obtenerTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerPorDiaSemana(dia: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dia/${dia}`);
  }

  obtenerPaginadas(page: number, size: number): Observable<{ content: any[]; totalPages: number; totalElements: number }> {
    return this.http.get<{ content: any[]; totalPages: number; totalElements: number }>(
      `${this.apiUrl}/paginated?page=${page}&size=${size}`
    );
  }

  contar(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/count`);
  }

  obtenerActividadesPorArea(areaId: number): Observable<any[]> {
    if (!this.areaActivitiesCache.has(areaId)) {
      this.areaActivitiesCache.set(areaId, this.http.get<any[]>(`${this.apiUrl}/area/${areaId}`).pipe(shareReplay(1)));
    }
    return this.areaActivitiesCache.get(areaId)!;
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crear(actividad: ActividadPayload): Observable<any> {
    this.invalidateAreaCache();
    return this.http.post<any>(this.apiUrl, actividad);
  }

  actualizar(id: number, actividad: ActividadPayload): Observable<any> {
    this.invalidateAreaCache();
    return this.http.put<any>(`${this.apiUrl}/${id}`, actividad);
  }

  eliminar(id: number): Observable<void> {
    this.invalidateAreaCache();
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private invalidateAreaCache(): void {
    this.areaActivitiesCache.clear();
  }
}
