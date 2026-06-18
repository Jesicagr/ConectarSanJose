// src/app/components/area/area.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaService, Area } from '../../services/area.service';
import { ActividadService } from '../../services/actividad.service';
import { Actividad } from '../../models/actividad.model';
import { WEBP_MAP, AREA_ORDER } from '../../shared/area-tones';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './area.html',
  styleUrl: './area.css'
})
export class AreaComponent implements OnInit {

  listaAreas: Area[] = [];
  mostrarModal: boolean = false;
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
      error: (err) => console.error('[ConectarSanJose] ERROR Error al cargar áreas:', err)
    });
  }


  abrirModal(areaId: number | undefined): void {
    if (areaId === undefined) return;
  
    this.areaService.obtenerPorId(areaId).subscribe({
      next: (areaCompleta) => {
        this.areaSeleccionada = areaCompleta;
        this.mostrarModal = true;
      },
      error: (err) => console.error('[ConectarSanJose] ERROR Error al traer detalles del área:', err)
    });

    this.actividadService.obtenerActividadesPorArea(areaId).subscribe({
      next: (actividades) => {
        this.actividadesPorArea = actividades;
      },
      error: (err) => console.error('[ConectarSanJose] ERROR Error al cargar actividades del área:', err)
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.areaSeleccionada = null;
    this.actividadesPorArea = [];
  }

  getIconPath(area: Area): string {
    const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const aNorm = normalize(area.nombre);
    const key = Object.keys(WEBP_MAP).find(k => normalize(k) === aNorm);
    return WEBP_MAP[key || ''] || 'assets/comunidad.webp';
  }

  getAreaTone(index: number): string {
    const colors = ['tone-celeste', 'tone-amarillo', 'tone-gris'];
    return colors[index % 3];
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}