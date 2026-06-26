import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActividadService } from '../../../services/actividad.service';
import { AreaService } from '../../../services/area.service';

import { getAreaTone, sortByAreaOrder, WEBP_MAP } from '../../../shared/area-tones';
import { DateFormatPipe } from '../../../shared/date-format.pipe';
import { ToastService } from '../../../shared/toast.service';
import { LoggerService } from '../../../shared/logger.service';
import { ActividadModalComponent, ActividadModalData } from '../../shared/actividad-modal/actividad-modal.component';

interface DashboardActivity {
  id: number;
  title: string;
  place: string;
  categories: string[];
  categoryIcons: string[];
  date: string;
  endDate?: string;
  status: string;
  statusTone: string;
  telefono?: string;
}

interface Metric {
  label: string;
  value: string;
  icon: string;
  tone: string;
  detail: string;
  change?: string;
  badge?: string;
}

interface CategoryFilter {
  label: string;
  icon: string;
  tone: string;
  count: number;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [FormsModule, DateFormatPipe, ActividadModalComponent],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  private actividadService = inject(ActividadService);
  private areaService = inject(AreaService);
  private toast = inject(ToastService);
  private logger = inject(LoggerService);

  loading = signal(true);
  searchTerm = signal('');
  selectedCategory = signal('');
  menuOpenIndex = signal<number | null>(null);
  modalOpen = signal(false);
  modalViewMode = signal(false);
  modalData = signal<ActividadModalData | null>(null);

  metrics = signal<Metric[]>([
    { label: 'Actividades Totales', value: '0', icon: 'confirmation_number', tone: 'primary', detail: 'Cargando...', change: '' },
    { label: 'En Revisión', value: '0', icon: 'history_edu', tone: 'warning', detail: 'Requieren validación técnica', badge: 'Pendientes' },
  ]);

  categories = signal<CategoryFilter[]>([]);
  activities = signal<DashboardActivity[]>([]);


  private areaToneMap: Record<string, string> = {};

  filteredActivities = computed(() => {
    const query = this.normalize(this.searchTerm());
    return this.activities().filter((activity) => {
      const matchesCategory = !this.selectedCategory() || activity.categories.includes(this.selectedCategory());
      const searchable = this.normalize(`${activity.title} ${activity.place} ${activity.categories.join(' ')} ${activity.status}`);
      const matchesSearch = !query || searchable.includes(query);
      return matchesCategory && matchesSearch;
    });
  });

  ngOnInit(): void {
    this.areaService.obtenerTodas().subscribe({
      next: (areas) => {
        const sorted = sortByAreaOrder(areas);
        this.areaToneMap = {};
        this.categories.set(sorted.map((a, i) => {
          this.areaToneMap[a.nombre] = getAreaTone(a.nombre, i);
          return {
            label: a.nombre,
            icon: WEBP_MAP[a.nombre] || 'assets/comunidad.webp',
            tone: getAreaTone(a.nombre, i),
            count: 0,
          };
        }));

        this.cargarActividades();
      },
      error: () => this.cargarActividades(),
    });
  }

  private cargarActividades(): void {
    this.actividadService.contar().subscribe({
      next: (res) => {
        this.metrics.update(m => {
          m[0].value = String(res.total);
          m[0].detail = 'Actividades registradas';
          return [...m];
        });
      },
      error: () => {}
    });
    this.actividadService.obtenerPaginadas(0, 100).subscribe({
      next: (page) => {
        const mapped = page.content.map((a: any) => ({
          id: a.id,
          title: a.titulo,
          place: a.sedeNombre || 'Sin Sede',
          categories: a.areaNombres?.length ? a.areaNombres : ['Sin Área'],
          categoryIcons: a.areaIconos?.length ? a.areaIconos : ['help'],
          date: a.fechaInicio || '',
          endDate: a.fechaFin || '',
          status: a.status || 'Confirmado',
          statusTone: 'success',
          telefono: a.telefono || '',
        }));
        this.activities.set(mapped);

        const countMap: Record<string, number> = {};
        for (const a of mapped) {
          for (const cat of a.categories) {
            countMap[cat] = (countMap[cat] || 0) + 1;
          }
        }
        this.categories.update(cats => cats.map(c => ({ ...c, count: countMap[c.label] || 0 })));

        const enRevision = mapped.filter(a => a.status === 'En Revisión').length;
        this.metrics.update(m => {
          m[1].value = String(enRevision);
          return [...m];
        });

        this.loading.set(false);
      },
      error: (err) => {
        this.logger.error('Error al cargar actividades', err);
        this.loading.set(false);
      },
    });
  }

  categoryTone(category: string): string {
    return this.areaToneMap[category] || 'surface-variant';
  }

  selectCategory(category: string): void {
    this.selectedCategory.update(c => c === category ? '' : category);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
  }

  toggleMenu(index: number): void {
    this.menuOpenIndex.update(i => i === index ? null : index);
  }

  closeMenu(): void {
    this.menuOpenIndex.set(null);
  }

  viewActivity(activity: DashboardActivity): void {
    this.closeMenu();
    this.modalData.set({
      id: activity.id,
      title: activity.title,
      category: activity.categories[0],
      categoryIcon: activity.categoryIcons[0],
      categories: activity.categories,
      categoryIcons: activity.categoryIcons,
      date: activity.date,
      endDate: activity.endDate,
      location: activity.place,
      telefono: activity.telefono,
      status: activity.status,
    });
    this.modalViewMode.set(true);
    this.modalOpen.set(true);
  }

  editActivity(activity: DashboardActivity): void {
    this.closeMenu();
    this.modalData.set({
      id: activity.id,
      title: activity.title,
      category: activity.categories[0],
      categoryIcon: activity.categoryIcons[0],
      categories: activity.categories,
      categoryIcons: activity.categoryIcons,
      date: activity.date,
      endDate: activity.endDate,
      location: activity.place,
      telefono: activity.telefono,
    });
    this.modalViewMode.set(false);
    this.modalOpen.set(true);
  }

  onModalSaved(): void {
    this.modalOpen.set(false);
    this.modalData.set(null);
    this.modalViewMode.set(false);
    this.cargarActividades();
  }

  onModalClosed(): void {
    this.modalOpen.set(false);
    this.modalData.set(null);
    this.modalViewMode.set(false);
  }

  deleteActivity(activity: DashboardActivity): void {
    this.closeMenu();
    if (!confirm(`¿Eliminar la actividad "${activity.title}"?`)) return;
    this.toast.show('Eliminando actividad…', 'info');
    this.actividadService.eliminar(activity.id).subscribe({
      next: () => {
        this.activities.update(list => list.filter(a => a.id !== activity.id));
        this.toast.show('Actividad eliminada con éxito', 'success');
      },
      error: (err) => {
        this.logger.error('Error al eliminar actividad:', err);
        this.toast.show('Error al eliminar la actividad', 'error');
      },
    });
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
