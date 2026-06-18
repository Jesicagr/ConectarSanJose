import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  obtenerTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
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
    return this.http.get<any[]>(`${this.apiUrl}/area/${areaId}`);
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crear(actividad: ActividadPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, actividad);
  }

  actualizar(id: number, actividad: ActividadPayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, actividad);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
