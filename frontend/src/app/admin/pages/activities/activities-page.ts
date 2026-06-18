import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ActividadService } from '../../../services/actividad.service';

import { AreaService } from '../../../services/area.service';
import { VisitaService } from '../../../services/visita.service';
import { getAreaTone, sortByAreaOrder } from '../../../shared/area-tones';
import { ToastService } from '../../../shared/toast.service';
import { LoggerService } from '../../../shared/logger.service';
import { DateFormatPipe } from '../../../shared/date-format.pipe';
import { ActividadModalComponent, ActividadModalData } from '../../shared/actividad-modal/actividad-modal.component';

type ActivityStatus = 'Confirmado' | 'En Revisión' | 'Cancelado';

interface Activity {
  id?: number;
  title: string;
  description: string;
  categories: string[];
  categoryIcons: string[];
  date: string;
  endDate?: string;
  time: string;
  location: string;
  status: ActivityStatus;
  statusTone: string;
  imageUrl?: string;
  visitas?: number;
  encargado?: string;
  telefono?: string;
}

@Component({
  selector: 'app-activities-page',
  imports: [FormsModule, DateFormatPipe, ActividadModalComponent],
  templateUrl: './activities-page.html',
  styleUrl: './activities-page.css',
})
export class ActivitiesPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private actividadService = inject(ActividadService);
  private areaService = inject(AreaService);
  private visitaService = inject(VisitaService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);
  private logger = inject(LoggerService);

  loading = true;
  loadingMore = false;


  searchTerm = '';
  selectedStatus = '';
  selectedCategory = '';
  dropdownOpen = false;

  categories: any[] = [];

  private readonly TONE_COLORS: Record<string, string> = {
    rose: '#be123c', amber: '#8a5a00', indigo: '#4338ca',
    emerald: '#047857', blue: '#0b5f61', red: '#dc2626',
    cyan: '#0e7490', orange: '#c2410c', purple: '#6b21a8',
    teal: '#0f766e', pink: '#be185d', violet: '#6d28d9',
  };

  allActivities: Activity[] = [];
  displayedActivities: Activity[] = [];
  renderCount = 50;
  sentinelObserver: IntersectionObserver | null = null;
  @ViewChild('sentinel', { static: false }) set sentinelRef(el: ElementRef<HTMLElement> | undefined) {
    this.onSentinel(el ? el.nativeElement : null);
  }

  ngOnInit(): void {
    this.areaService.obtenerTodas().subscribe({
      next: areas => {
        const sorted = sortByAreaOrder(areas);
        this.categories = sorted.map((a, i) => {
          const tone = getAreaTone(a.nombre, i);
          return {
            id: a.id,
            label: a.nombre,
            icon: a.icono || 'assets/comunidad.webp',
            tone,
            toneColor: this.TONE_COLORS[tone] || '#666',
          };
        });
        this.cdr.detectChanges();
      },
      error: err => this.logger.error('Error al cargar areas en activities:', err)
    });
    this.cargarActividades();
  }

  private mapActividad(a: any): Activity {
    return {
      id: a.id,
      title: a.titulo,
      description: a.descripcion || 'Sin descripción',
      categories: a.areaNombres?.length ? a.areaNombres : ['Sin Área'],
      categoryIcons: a.areaIconos?.length ? a.areaIconos : ['assets/comunidad.webp'],
      date: a.fechaInicio || '',
      endDate: a.fechaFin || '',
      time: a.horario || 'Sin horario',
      location: a.sedeNombre || 'Sin Sede',
      status: a.status || 'Confirmado',
      statusTone: a.statusTone || 'success',
      visitas: 0,
      encargado: a.encargado,
      telefono: a.telefono || ''
    };
  }

  ngOnDestroy(): void {
    this.sentinelObserver?.disconnect();
  }

  cargarActividades(): void {
    this.loading = true;
    this.cdr.detectChanges();

    const PAGE_SIZE = 200;
    if (PAGE_SIZE > 100) {
      this.logger.warn('Solicitando {} actividades (excede el límite recomendado de 100)', PAGE_SIZE);
    }
    forkJoin({
      actividades: this.actividadService.obtenerPaginadas(0, PAGE_SIZE),
      visitas: this.visitaService.visitasPorActividad()
    }).subscribe({
      next: ({ actividades, visitas }) => {
        this.allActivities = (actividades.content || []).map(a => this.mapActividad(a));
        this.allActivities.forEach(a => {
          if (a.id != null && visitas[a.id] != null) {
            a.visitas = visitas[a.id];
          }
        });
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();

        const editId = this.route.snapshot.queryParams['edit'];
        if (editId) {
          const target = this.allActivities.find(a => a.id === Number(editId));
          if (target) {
            this.openEditModal(target);
          }
        }
      },
      error: err => {
        this.logger.error('Error al cargar actividades:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMore(): void {
    if (this.loadingMore || this.renderCount >= this.displayedActivities.length) return;
    this.loadingMore = true;
    this.renderCount = Math.min(this.renderCount + 20, this.displayedActivities.length);
    this.loadingMore = false;
    this.cdr.detectChanges();
  }

  onSentinel(element: HTMLElement | null): void {
    this.sentinelObserver?.disconnect();
    if (!element) return;
    this.sentinelObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.loadMore();
      }
    }, { rootMargin: '300px' });
    this.sentinelObserver.observe(element);
  }

  private applyFilters(): void {
    const query = this.normalize(this.searchTerm);
    const filtered = this.allActivities.filter((activity) => {
      const matchesCategory = !this.selectedCategory || activity.categories.includes(this.selectedCategory);
      const matchesStatus = !this.selectedStatus || activity.status === this.selectedStatus;
      const searchable = this.normalize(
        `${activity.title} ${activity.description} ${activity.location} ${activity.categories.join(' ')} ${activity.status}`,
      );
      const matchesSearch = !query || searchable.includes(query);
      return matchesCategory && matchesStatus && matchesSearch;
    });
    this.displayedActivities = filtered;
    this.renderCount = Math.min(50, filtered.length);
    this.cdr.detectChanges();
  }

  get filteredActivities(): Activity[] {
    return this.displayedActivities.slice(0, this.renderCount);
  }

  get selectedCategoryData(): any {
    return this.categories.find(c => c.label === this.selectedCategory) || null;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.category-select')) {
      this.closeDropdown();
    }
  }

  selectCategory(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  deleteActivity(activity: Activity): void {
    if (!confirm(`¿Eliminar la actividad "${activity.title}"?`)) return;
    if (activity.id == null) return;
    this.toast.show('Eliminando actividad…', 'info');
    this.actividadService.eliminar(activity.id).subscribe({
      next: () => {
        this.cargarActividades();
        this.toast.show('Actividad eliminada con éxito', 'success');
      },
      error: (err: unknown) => {
        this.logger.error('Error al eliminar actividad:', err);
        this.toast.show('Error al eliminar la actividad', 'error');
      }
    });
  }

  categoryToneClass(category: string): string {
    const found = this.categories.find(c => c.label === category);
    return found ? found.tone : 'surface-variant';
  }

  statusPillClass(status: string): string {
    if (status === 'Confirmado') return 'status-confirmed';
    if (status === 'En Revisión') return 'status-review';
    return 'status-cancelled';
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  modalData?: ActividadModalData | null = null;
  modalOpen = false;
  modalViewMode = false;

  openModal(): void {
    this.modalData = null;
    this.modalOpen = true;
    this.modalViewMode = false;
  }

  private buildModalData(activity: Activity): ActividadModalData {
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: activity.categories[0],
      categoryIcon: activity.categoryIcons[0],
      categories: activity.categories,
      categoryIcons: activity.categoryIcons,
      date: activity.date,
      endDate: activity.endDate,
      time: activity.time,
      location: activity.location,
      encargado: activity.encargado,
      telefono: activity.telefono,
      status: activity.status,
    };
  }

  openViewModal(activity: Activity): void {
    this.modalData = this.buildModalData(activity);
    this.modalViewMode = true;
    this.modalOpen = true;
  }

  openEditModal(activity: Activity): void {
    this.modalData = this.buildModalData(activity);
    this.modalViewMode = false;
    this.modalOpen = true;
  }

  onModalClosed(): void {
    this.modalOpen = false;
    this.modalData = null;
    this.modalViewMode = false;
  }

  onModalSaved(): void {
    this.modalOpen = false;
    this.modalData = null;
    this.modalViewMode = false;
    this.cargarActividades();
  }
}
