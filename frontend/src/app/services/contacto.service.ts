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

  private static readonly WA_FLOAT_KEY = 'conectar_whatsapp_flotante_numero';
  private static readonly WA_LABEL_KEY = 'conectar_whatsapp_flotante_label';

  getWhatsappFlotanteNumero(): string {
    return localStorage.getItem(ContactoService.WA_FLOAT_KEY) || '';
  }

  setWhatsappFlotanteNumero(numero: string): void {
    if (numero) {
      localStorage.setItem(ContactoService.WA_FLOAT_KEY, numero);
    } else {
      localStorage.removeItem(ContactoService.WA_FLOAT_KEY);
    }
  }

  getWhatsappFlotanteLabel(): string {
    return localStorage.getItem(ContactoService.WA_LABEL_KEY) || 'Mesa de Entrada';
  }

  setWhatsappFlotanteLabel(label: string): void {
    if (label) {
      localStorage.setItem(ContactoService.WA_LABEL_KEY, label);
    } else {
      localStorage.removeItem(ContactoService.WA_LABEL_KEY);
    }
  }
}
