import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SedeService, Sede } from '../../../services/sede.service';
import { ToastService } from '../../../shared/toast.service';
import { LoggerService } from '../../../shared/logger.service';
import { getPhoneLink } from '../../../shared/link-utils';
import * as L from 'leaflet';

@Component({
  selector: 'app-sedes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sedes-page.html',
  styleUrl: './sedes-page.css',
})
export class SedesPage implements OnInit, OnDestroy {
  private sedeService = inject(SedeService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);
  private logger = inject(LoggerService);

  loading = true;
  searchTerm = '';
  sedes: Sede[] = [];
  isModalOpen = false;
  editingId: number | null = null;
  saving = false;
  geocoding = false;
  geocodingAll = false;

  map: L.Map | null = null;
  markers: L.Marker[] = [];
  selectedSedeForMap: Sede | null = null;

  private modalMap: L.Map | null = null;

  readonly SAN_JOSE_COORDS: [number, number] = [-32.2000, -58.2170];
  readonly DEFAULT_ZOOM = 13;

  newSedeForm: Partial<Sede> & { esWhatsapp: boolean; latitud: number | null; longitud: number | null; schedules: { dayFrom: string; dayTo: string; startTime: string; endTime: string }[] } = {
    nombre: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    icono: 'storefront',
    esWhatsapp: false,
    latitud: null,
    longitud: null,
    schedules: [{ dayFrom: 'Lunes', dayTo: 'Viernes', startTime: '10:00', endTime: '13:00' }],
  };

  iconOptions = [
    'storefront',
    'park',
    'local_library',
    'apartment',
    'sports_soccer',
    'school',
    'museum',
    'local_hospital',
    'spa'
  ];

  ngOnInit(): void {
    this.cargarSedes();
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }

  cargarSedes(): void {
    this.sedeService.obtenerTodas().subscribe({
      next: (sedes) => {
        this.sedes = [...sedes].sort((a, b) => {
          const aPriority = /CAPS|CIC/i.test(a.nombre) ? 0 : 1;
          const bPriority = /CAPS|CIC/i.test(b.nombre) ? 0 : 1;
          return aPriority - bPriority;
        });
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.initMap(), 100);
      },
      error: (err) => {
        this.logger.error('Error al cargar las sedes:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private initMap(): void {
    this.destroyMap();
    const el = document.getElementById('sedes-map');
    if (!el) return;

    this.map = L.map(el, { zoomControl: true }).setView(this.SAN_JOSE_COORDS, this.DEFAULT_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    this.addSedeMarkers();

    if (this.selectedSedeForMap) {
      this.flyToSede(this.selectedSedeForMap);
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.isModalOpen) {
        this.newSedeForm.latitud = parseFloat(e.latlng.lat.toFixed(6));
        this.newSedeForm.longitud = parseFloat(e.latlng.lng.toFixed(6));
        this.cdr.detectChanges();
      }
    });
  }

  private addSedeMarkers(): void {
    if (!this.map) return;
    this.clearMarkers();

    for (const sede of this.sedes) {
      if (sede.latitud != null && sede.longitud != null) {
        const marker = L.marker([sede.latitud, sede.longitud], { icon: this.markerIcon() })
          .addTo(this.map)
          .bindPopup(`<strong>${sede.nombre}</strong><br>${sede.direccion || 'Dirección no especificada'}`);
        this.markers.push(marker);
      }
    }
  }

  private markerIcon(): L.DivIcon {
    return L.divIcon({
      className: '',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3))">
          <div style="width:40px;height:40px;border-radius:50%;background:#fff;border:3px solid #0047AB;display:flex;align-items:center;justify-content:center">
            <img src="assets/logo.webp" alt="" style="width:24px;height:24px;object-fit:contain" />
          </div>
          <div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid #0047AB;margin-top:-2px"></div>
        </div>
      `,
      iconSize: [40, 52],
      iconAnchor: [20, 52],
    });
  }

  private clearMarkers(): void {
    for (const m of this.markers) {
      m.remove();
    }
    this.markers = [];
  }

  verEnMapa(sede: Sede): void {
    this.selectedSedeForMap = sede;
    this.flyToSede(sede);
  }

  private flyToSede(sede: Sede): void {
    if (!this.map || sede.latitud == null || sede.longitud == null) return;
    this.map.setView([sede.latitud, sede.longitud], 16);
    setTimeout(() => this.map?.invalidateSize(), 200);
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers = [];
  }

  get filteredSedes(): Sede[] {
    const query = this.normalize(this.searchTerm);
    return this.sedes.filter((sede) => {
      const nombre = sede.nombre ? this.normalize(sede.nombre) : '';
      const descripcion = sede.descripcion ? this.normalize(sede.descripcion) : '';
      const direccion = sede.direccion ? this.normalize(sede.direccion) : '';
      const searchable = `${nombre} ${descripcion} ${direccion}`;
      return !query || searchable.includes(query);
    });
  }

  openModal(): void {
    this.editingId = null;
    this.newSedeForm = {
      nombre: '',
      descripcion: '',
      direccion: '',
      telefono: '',
      icono: 'storefront',
      esWhatsapp: false,
      latitud: null,
      longitud: null,
      schedules: [{ dayFrom: 'Lunes', dayTo: 'Viernes', startTime: '10:00', endTime: '13:00' }],
    };
    this.isModalOpen = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      const el = document.getElementById('modal-map');
      if (el && this.isModalOpen) {
        const miniMap = L.map(el, { zoomControl: true }).setView(this.SAN_JOSE_COORDS, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 19,
        }).addTo(miniMap);

        miniMap.on('click', (e: L.LeafletMouseEvent) => {
          this.setModalMarker(e.latlng, miniMap);
        });

        this.modalMap = miniMap;
      }
    }, 200);
  }

  private formatDay(day: string | null | undefined): string {
    if (!day) return 'Lunes';
    const dayMap: Record<string, string> = {
      LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles',
      JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sábado', DOMINGO: 'Domingo',
    };
    return dayMap[day] || 'Lunes';
  }

openEditModal(sede: Sede): void {
    this.editingId = sede.id ?? null;
    this.newSedeForm = {
        nombre: sede.nombre || '',
        descripcion: sede.descripcion || '',
        telefono: sede.telefono || '',
        direccion: sede.direccion || '',
        icono: sede.icono || 'storefront',
        esWhatsapp: sede.esWhatsapp ?? true,
        latitud: sede.latitud ?? null,
        longitud: sede.longitud ?? null,
        schedules: sede.horarios && sede.horarios.length > 0
            ? sede.horarios.map(h => ({
                dayFrom: this.formatDay(h.diaDesde),
                dayTo: this.formatDay(h.diaHasta),
                startTime: (h.horaInicio || '07:00').substring(0, 5),
                endTime: (h.horaFin || '13:00').substring(0, 5),
            }))
            : [{ dayFrom: 'Lunes', dayTo: 'Viernes', startTime: '07:00', endTime: '13:00' }],
    };
    this.isModalOpen = true;
  }

  private setModalMarker(latlng: L.LatLngExpression, map: L.Map, updateForm = true): void {
    const ll = latlng instanceof L.LatLng ? latlng : L.latLng(latlng);
    if (updateForm) {
      this.newSedeForm.latitud = parseFloat(ll.lat.toFixed(6));
      this.newSedeForm.longitud = parseFloat(ll.lng.toFixed(6));
    }
    map.eachLayer(layer => { if (layer instanceof L.Marker) map.removeLayer(layer); });
    L.marker(ll, { icon: this.markerIcon() }).addTo(map);
    this.cdr.detectChanges();
  }

  geocodeAddress(): void {
    const address = this.newSedeForm.direccion?.trim();
    if (!address) {
      this.toast.show('Escribí una dirección primero', 'info');
      return;
    }
    this.geocoding = true;
    const query = encodeURIComponent(`${address}, San José, Entre Ríos, Argentina`);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
      headers: { 'Accept-Language': 'es' }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(parseFloat(data[0].lat).toFixed(6));
          const lng = parseFloat(parseFloat(data[0].lon).toFixed(6));
          this.newSedeForm.latitud = lat;
          this.newSedeForm.longitud = lng;
          const mm = this.modalMap;
          if (mm) {
            mm.setView([lat, lng], 16);
            this.setModalMarker([lat, lng], mm, false);
          }
          this.toast.show('Ubicación encontrada en el mapa', 'success');
        } else {
          this.toast.show('No se encontró la dirección', 'info');
        }
      })
      .catch(() => this.toast.show('Error al buscar la dirección', 'error'))
      .finally(() => { this.geocoding = false; this.cdr.detectChanges(); });
  }

  async geocodeAllPending(): Promise<void> {
    const pendientes = this.sedes.filter(s => s.direccion && (s.latitud == null || s.longitud == null));

    if (pendientes.length === 0) {
      this.toast.show('No hay sedes pendientes de geocodificar', 'info');
      return;
    }

    this.geocodingAll = true;
    let exitosas = 0;
    let fallidas = 0;

    for (let i = 0; i < pendientes.length; i++) {
      const sede = pendientes[i];
      try {
        const query = encodeURIComponent(`${sede.direccion}, San José, Entre Ríos, Argentina`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
          { headers: { 'Accept-Language': 'es' } }
        );
        const data = await res.json();

        if (data && data.length > 0 && sede.id != null) {
          const lat = parseFloat(parseFloat(data[0].lat).toFixed(6));
          const lng = parseFloat(parseFloat(data[0].lon).toFixed(6));
          await firstValueFrom(this.sedeService.actualizar(sede.id, { latitud: lat, longitud: lng }));
          exitosas++;
        } else {
          fallidas++;
        }
      } catch {
        fallidas++;
      }

      if (i < pendientes.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    this.geocodingAll = false;
    this.cargarSedes();
    this.toast.show(`${exitosas} geocodificada(s), ${fallidas} sin resultado`, fallidas > 0 ? 'error' : 'success');
  }

  onOverlayMouseDown(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    if (this.modalMap) { this.modalMap.remove(); this.modalMap = null; }
  }

  selectIcon(icon: string): void {
    this.newSedeForm.icono = icon;
  }

  addSchedule(): void {
    this.newSedeForm.schedules.push({ dayFrom: 'Lunes', dayTo: 'Viernes', startTime: '10:00', endTime: '13:00' });
  }

  removeSchedule(index: number): void {
    this.newSedeForm.schedules.splice(index, 1);
  }

  saveSede(): void {
    if (!this.newSedeForm.nombre) {
      this.toast.show('Completa el nombre de la sede', 'error');
      return;
    }

    const payload: any = {
      nombre: this.newSedeForm.nombre,
      descripcion: this.newSedeForm.descripcion,
      direccion: this.newSedeForm.direccion,
      telefono: this.newSedeForm.telefono,
      icono: this.newSedeForm.icono,
      esWhatsapp: this.newSedeForm.esWhatsapp,
      horarios: this.newSedeForm.schedules.map(sch => ({
        diaDesde: sch.dayFrom.toUpperCase(),
        diaHasta: sch.dayTo.toUpperCase(),
        horaInicio: sch.startTime + ':00',
        horaFin: sch.endTime + ':00',
      })),
    };
    if (this.newSedeForm.latitud != null) payload.latitud = this.newSedeForm.latitud;
    if (this.newSedeForm.longitud != null) payload.longitud = this.newSedeForm.longitud;

    this.saving = true;
    const request$ = this.editingId
      ? this.sedeService.actualizar(this.editingId, payload)
      : this.sedeService.crear(payload);

    request$.subscribe({
      next: () => {
        this.cargarSedes();
        this.closeModal();
        this.saving = false;
        this.toast.show(this.editingId ? 'Sede actualizada con éxito' : 'Sede creada con éxito', 'success');
      },
      error: (err: unknown) => {
        this.logger.error('Error al guardar la sede:', err);
        this.saving = false;
        this.toast.show('Error al guardar la sede', 'error');
      }
    });
  }

  deleteSede(sede: Sede): void {
    if (!confirm(`¿Eliminar la sede "${sede.nombre}"?`)) return;
    if (sede.id == null) return;
    this.toast.show('Eliminando sede…', 'info');
    this.sedeService.eliminar(sede.id).subscribe({
      next: () => {
        this.cargarSedes();
        this.toast.show('Sede eliminada con éxito', 'success');
      },
      error: (err) => {
        this.logger.error('Error al eliminar sede:', err);
        this.toast.show('Error al eliminar la sede', 'error');
      }
    });
  }

  iconTone(icono?: string): string {
    const tones: Record<string, string> = {
      storefront: 'primary',
      park: 'secondary',
      local_library: 'tertiary',
      apartment: 'primary',
      sports_soccer: 'success',
      school: 'warning',
      museum: 'primary',
      local_hospital: 'danger',
      spa: 'tertiary',
    };
    return tones[icono || ''] || 'primary';
  }

  private normalize(value: string): string {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  soloNumeros(value: string): string {
    return value.replace(/\D/g, '');
  }

  phoneLink(numero: string, wa?: boolean): string {
    return getPhoneLink(numero, wa);
  }
}
