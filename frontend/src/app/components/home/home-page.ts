import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaService, Area } from '../../services/area.service';
import { ActividadService } from '../../services/actividad.service';
import { Actividad } from '../../models/actividad.model';
import { WEBP_MAP, AREA_ORDER } from '../../shared/area-tones';
import { AgendaComponent } from '../agenda/agenda';
import { getPhoneLink, getAddressLink, getEmailLink, getWebLink, isUrl } from '../../shared/link-utils';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, AgendaComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  menuAbierto: boolean = false;
  mostrarModalAyuda: boolean = false;
  mostrarModalArea: boolean = false;
  listaAreas: Area[] = [];
  areaSeleccionada: Area | null = null;
  actividadesPorArea: Actividad[] = [];

  constructor(
    private areaService: AreaService,
    private actividadService: ActividadService,
  ) {}

  ngOnInit(): void {
    this.cargarAreas();
  }

  cargarAreas(): void {
    this.areaService.obtenerTodas().subscribe({
      next: (data) => {
        this.listaAreas = [...data].sort((a, b) => {
          const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
          const aNorm = normalize(a.nombre);
          const bNorm = normalize(b.nombre);
          const ai = AREA_ORDER.findIndex(name => normalize(name) === aNorm);
          const bi = AREA_ORDER.findIndex(name => normalize(name) === bNorm);
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        });
      },
      error: (err) => console.error('[ConectarSanJose] Error al cargar áreas:', err)
    });
  }

  abrirModalArea(nombreClave: string): void {
    const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const claveNorm = normalize(nombreClave);
    const area = this.listaAreas.find(a => {
      const aNorm = normalize(a.nombre);
      return aNorm.includes(claveNorm) || claveNorm.includes(aNorm);
    });
    if (!area || area.id === undefined) return;

    this.areaService.obtenerPorId(area.id).subscribe({
      next: (areaCompleta) => {
        this.areaSeleccionada = areaCompleta;
        this.mostrarModalArea = true;
      },
      error: (err) => console.error('[ConectarSanJose] Error al traer detalles del área:', err)
    });

    this.actividadService.obtenerActividadesPorArea(area.id).subscribe({
      next: (actividades) => {
        this.actividadesPorArea = actividades;
      },
      error: (err) => console.error('[ConectarSanJose] Error al cargar actividades del área:', err)
    });
  }

  cerrarModalArea(): void {
    this.mostrarModalArea = false;
    this.areaSeleccionada = null;
    this.actividadesPorArea = [];
  }

  getIconPath(area: Area): string {
    const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const aNorm = normalize(area.nombre);
    const key = Object.keys(WEBP_MAP).find(k => normalize(k) === aNorm);
    return WEBP_MAP[key || ''] || 'assets/comunidad.webp';
  }

  private ACCENT_COLORS: Record<string, string> = {
    'Mujeres Género y Diversidad': '#9acb92',
    'Mujer': '#9acb92',
    'Niñez, Adolescencia y Familia': '#d6c75d',
    'Niñez': '#d6c75d',
    'Personas Mayores': '#9acb92',
    'Desarrollo Comunitario': '#8fc6d9',
    'Discapacidad': '#d6c75d',
    'Salud': '#9acb92',
    'Salud Social y Comunitaria': '#9acb92',
    'Trabajo y Producción': '#8fc6d9',
    'Trabajo': '#8fc6d9',
    'Deportes y Recreación': '#d6c75d',
    'Deportes': '#d6c75d',
    'Turismo': '#8fc6d9',
    'Cultura': '#8fc6d9',
    'Educación': '#d6c75d',
  };

  getAccentColor(area: Area): string {
    const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const aNorm = normalize(area.nombre);
    const key = Object.keys(this.ACCENT_COLORS).find(k => normalize(k) === aNorm);
    return this.ACCENT_COLORS[key || ''] || '#9acb92';
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  phoneLink(numero: string, wa?: boolean): string {
    return getPhoneLink(numero, wa);
  }

  addressLink(dir: string): string {
    return getAddressLink(dir);
  }

  emailLink(email: string): string {
    return getEmailLink(email);
  }

  webLink(sitio: string): string {
    return getWebLink(sitio);
  }

  isUrl(str: string): boolean {
    return isUrl(str);
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
    document.body.style.overflow = this.menuAbierto ? 'hidden' : '';
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
    document.body.style.overflow = '';
  }

  irInicio(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  abrirAyuda() {
    this.mostrarModalAyuda = true;
  }

  cerrarAyuda() {
    this.mostrarModalAyuda = false;
  }
}
