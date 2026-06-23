import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AreaComponent } from './area';
import { AreaService } from '../../services/area.service';

describe('AreaComponent', () => {
  let component: AreaComponent;
  let fixture: ComponentFixture<AreaComponent>;

  const mockAreas = [
    { id: 1, nombre: 'Cultura', icono: 'theater_comedy' },
    { id: 2, nombre: 'Deportes', icono: 'sports_soccer' },
  ];

  beforeEach(async () => {
    const serviceMock = {
      obtenerTodas: () => of(mockAreas),
    };

    await TestBed.configureTestingModule({
      imports: [AreaComponent],
      providers: [
        provideHttpClient(),
        { provide: AreaService, useValue: serviceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load areas on init', () => {
    expect(component.listaAreas.length).toBe(2);
  });

  it('should display area buttons in the grid', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.boton-area');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Deportes');
    expect(buttons[1].textContent).toContain('Cultura');
  });

  it('should display area icon image with valid src', () => {
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('.boton-area img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toContain('.webp');
  });
});
