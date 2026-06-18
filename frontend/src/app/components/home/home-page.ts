import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaComponent } from '../agenda/agenda';
import { AreaService, Area } from '../../services/area.service';
import { ActividadService } from '../../services/actividad.service';
import { Actividad } from '../../models/actividad.model';
import { WEBP_MAP } from '../../shared/area-tones';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, AgendaComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  mostrarModalAyuda: boolean = false;
  menuAbierto: boolean = false;
  mostrarModalArea: boolean = false;
  areaSeleccionada: Area | null = null;
  actividadesPorArea: Actividad[] = [];
  listaAreas: Area[] = [];

  private nombreMap: Record<string, string> = {
    'mujer': 'Mujer',
    'ninez': 'Niñez',
    'mayores': 'Personas Mayores',
    'comunidad': 'Desarrollo Comunitario',
    'discapacidad': 'Discapacidad',
    'salud': 'Salud',
    'trabajo': 'Trabajo',
    'deportes': 'Deportes',
    'turismo': 'Turismo',
    'cultura': 'Cultura',
    'educacion': 'Educación',
  };

  constructor(
    private areaService: AreaService,
    private actividadService: ActividadService,
  ) {}

  ngOnInit(): void {
    this.areaService.obtenerTodas().subscribe({
      next: (data) => this.listaAreas = data,
      error: () => this.listaAreas = [],
    });
  }

  abrirAyuda() {
    this.mostrarModalAyuda = true;
  }

  cerrarAyuda() {
    this.mostrarModalAyuda = false;
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  private abrirModalArea(nombreCorto: string): void {
    const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const targetNorm = normalize(this.nombreMap[nombreCorto] || nombreCorto);

    const match = () => {
      return this.listaAreas.find(a => normalize(a.nombre) === targetNorm)
        || this.listaAreas.find(a => normalize(a.nombre).includes(targetNorm))
        || this.listaAreas.find(a => targetNorm.includes(normalize(a.nombre)))
        || null;
    };

    let area = match();

    if (!area) {
      this.areaService.obtenerTodas().subscribe({
        next: (data) => {
          this.listaAreas = data;
          area = match();
          if (area) {
            this.areaSeleccionada = area;
            this.mostrarModalArea = true;
          }
        },
      });
      return;
    }

    this.areaSeleccionada = area;
    this.mostrarModalArea = true;

    if (area.id !== undefined) {
      this.actividadService.obtenerActividadesPorArea(area.id).subscribe({
        next: (actividades) => this.actividadesPorArea = actividades,
      });
    }
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

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  mostrarMujeres() { this.abrirModalArea('mujer'); }
  mostrarNinez() { this.abrirModalArea('ninez'); }
  mostrarMayores() { this.abrirModalArea('mayores'); }
  mostrarComunidad() { this.abrirModalArea('comunidad'); }
  mostrarDiscapacidad() { this.abrirModalArea('discapacidad'); }
  mostrarSalud() { this.abrirModalArea('salud'); }
  mostrarTrabajo() { this.abrirModalArea('trabajo'); }
  mostrarDeportes() { this.abrirModalArea('deportes'); }
  mostrarTurismo() { this.abrirModalArea('turismo'); }
  mostrarCultura() { this.abrirModalArea('cultura'); }
  mostrarEducacion() { this.abrirModalArea('educacion'); }
}
