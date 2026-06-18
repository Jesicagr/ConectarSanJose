import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AgendaComponent } from './agenda';
import { ActividadService } from '../../services/actividad';
import { Actividad, DiaSemana, Sede } from '../../models/actividad.model';

function buildSede(overrides?: Partial<Sede>): Sede {
  return {
    id: 1,
    nombre: 'Sede Central',
    descripcion: 'Descripción sede',
    direccion: 'Av. Principal 123',
    telefono: '3447-123456',
    icono: 'location_city',
    esWhatsapp: false,
    ...overrides,
  };
}

function buildActividad(overrides?: Partial<Actividad>): Actividad {
  return {
    id: 1,
    titulo: 'Taller de Arte',
    descripcion: 'Descripción del taller',
    fechaInicio: '2026-06-10',
    fechaFin: '2026-06-10',
    repetirTodoAnio: false,
    sede: buildSede(),
    horarios: [
      {
        diaSemana: DiaSemana.LUNES,
        horaInicio: '10:00:00',
        horaFin: '12:00:00',
      },
    ],
    ...overrides,
  };
}

describe('AgendaComponent', () => {
  let component: AgendaComponent;
  let fixture: ComponentFixture<AgendaComponent>;
  let service: ActividadService;

  const mockActividades: Actividad[] = [
    buildActividad({
      id: 1,
      titulo: 'Taller de Pintura',
      encargado: 'Ana López',
      telefono: '3447-111111',
      horarios: [{ diaSemana: DiaSemana.LUNES, horaInicio: '09:00:00', horaFin: '11:00:00' }],
    }),
    buildActividad({
      id: 2,
      titulo: 'Clase de Yoga',
      encargado: 'Carlos Gómez',
      telefono: '3447-222222',
      horarios: [{ diaSemana: DiaSemana.MARTES, horaInicio: '10:00:00', horaFin: '11:30:00' }],
      sede: buildSede({ nombre: 'Polideportivo Municipal' }),
    }),
    buildActividad({
      id: 3,
      titulo: 'Feria de Artesanos',
      encargado: 'María Pérez',
      telefono: '3447-333333',
      horarios: [{ diaSemana: DiaSemana.MIERCOLES, horaInicio: '16:00:00', horaFin: '20:00:00' }],
      descripcion_corta: 'Feria con más de 50 artesanos locales',
    }),
  ];

  beforeEach(async () => {
    const serviceMock = {
      obtenerActividades: () => of(mockActividades),
    };

    await TestBed.configureTestingModule({
      imports: [AgendaComponent],
      providers: [
        provideHttpClient(),
        { provide: ActividadService, useValue: serviceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ActividadService);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load activities on init', () => {
    expect(component.listaActividades.length).toBe(3);
  });

  it('should filter activities by selected day (LUNES)', () => {
    const lunesIdx = component.diasSemana.findIndex(d => d.fechaCompleta.getDay() === 1);
    expect(lunesIdx).not.toBe(-1);
    component.diaSeleccionado = component.diasSemana[lunesIdx];
    component.filtrarActividades();
    expect(component.actividadesFiltradas.length).toBeGreaterThanOrEqual(1);
    component.actividadesFiltradas.forEach(a => {
      const hasLunes = a.horarios?.some(h => h.diaSemana === DiaSemana.LUNES);
      expect(hasLunes).toBe(true);
    });
  });

  it('should show "no activities" message when filter is empty', () => {
    component.listaActividades = [];
    component.filtrarActividades();
    fixture.detectChanges();

    const emptyMsg: HTMLElement | null = fixture.nativeElement.querySelector('.sin-actividades');
    expect(emptyMsg).toBeTruthy();
    expect(emptyMsg!.textContent).toContain('No hay actividades');
  });

  it('should display activity cards when activities match', () => {
    component.listaActividades = mockActividades;
    const lunesIdx = component.diasSemana.findIndex(d => d.fechaCompleta.getDay() === 1);
    component.diaSeleccionado = lunesIdx !== -1
      ? component.diasSemana[lunesIdx]
      : component.diasSemana[0];
    component.filtrarActividades();
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.tarjeta-actividad');
    expect(cards.length).toBe(component.actividadesFiltradas.length);
    if (cards.length > 0) {
      expect(cards[0].textContent).toContain('Taller de Pintura');
    }
  });

  it('should show activity title, sede, encargado and telefono in cards', () => {
    component.listaActividades = [mockActividades[1]];
    const martesIdx = component.diasSemana.findIndex(d => d.fechaCompleta.getDay() === 2);
    if (martesIdx === -1) return;

    component.diaSeleccionado = component.diasSemana[martesIdx];
    component.filtrarActividades();
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.tarjeta-actividad');
    expect(card).toBeTruthy();
    expect(card!.textContent).toContain('Clase de Yoga');
    expect(card!.textContent).toContain('Polideportivo Municipal');
    expect(card!.textContent).toContain('Carlos Gómez');
    expect(card!.textContent).toContain('3447-222222');
  });

  it('should select current day by default', () => {
    const hoy = new Date();
    expect(component.diaSeleccionado.fechaCompleta.getDate()).toBe(hoy.getDate());
    expect(component.diaSeleccionado.fechaCompleta.getMonth()).toBe(hoy.getMonth());
    expect(component.diaSeleccionado.fechaCompleta.getFullYear()).toBe(hoy.getFullYear());
  });

  it('should generate 6 days in the week view', () => {
    expect(component.diasSemana.length).toBe(6);
  });

  it('should update filtered activities when selecting a different day', () => {
    component.listaActividades = mockActividades;
    component.filtrarActividades();
    const beforeCount = component.actividadesFiltradas.length;

    const diaValido = component.diasSemana.find(d =>
      mockActividades.some(a =>
        a.horarios?.some(h => {
          const map: Record<number, DiaSemana> = {
            1: DiaSemana.LUNES, 2: DiaSemana.MARTES, 3: DiaSemana.MIERCOLES,
            4: DiaSemana.JUEVES, 5: DiaSemana.VIERNES, 6: DiaSemana.SABADO,
            0: DiaSemana.DOMINGO,
          };
          return h.diaSemana === map[d.fechaCompleta.getDay()];
        })
      )
    );
    if (!diaValido) return;

    component.seleccionarDia(diaValido);
    fixture.detectChanges();
    expect(component.actividadesFiltradas.length).toBeGreaterThanOrEqual(1);
  });
});
