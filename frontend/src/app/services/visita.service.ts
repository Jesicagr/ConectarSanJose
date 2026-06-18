import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

export interface VisitaStats {
  total: number;
  hoy: number;
  semana: number;
}

@Injectable({
  providedIn: 'root'
})
export class VisitaService {
  private http = inject(HttpClient);
  private apiUrl = '/api/visitas';
  private statsCache$: Observable<VisitaStats> | null = null;
  private visitasActividadCache$: Observable<Record<number, number>> | null = null;

  registrar(pagina: string): Observable<void> {
    return this.http.post<void>(this.apiUrl, { pagina });
  }

  obtenerStats(): Observable<VisitaStats> {
    if (!this.statsCache$) {
      this.statsCache$ = this.http.get<VisitaStats>(`${this.apiUrl}/stats`).pipe(shareReplay(1));
    }
    return this.statsCache$;
  }

  registrarActividad(id: number): Observable<void> {
    return this.http.post<void>(this.apiUrl, { pagina: `actividad-${id}` });
  }

  visitasPorActividad(): Observable<Record<number, number>> {
    return this.http.get<Record<number, number>>(`${this.apiUrl}/stats/actividades`);
  }
}
