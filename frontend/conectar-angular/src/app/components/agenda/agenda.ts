import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadService } from '../../services/actividad';
import { VisitaService } from '../../services/visita.service';
import { Actividad, DiaSemana } from '../../models/actividad.model';

interface DiaAgenda {
  nombreCorto: string; // "LUN", "MAR"
  numero: number;      // 14, 15
  fechaCompleta: Date;
  labelDiaCompleto: string; // "Lunes", "Martes"
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css'
})
export class AgendaComponent implements OnInit {
  
  listaActividades: Actividad[] = [];
  actividadesFiltradas: Actividad[] = [];
  
  diasSemana: DiaAgenda[] = [];
  diaSeleccionado!: DiaAgenda;
  fechaCalendario: string = ''; // Enlace con el <input type="date">
  offsetDias: number = 0;

  actividadSeleccionada: Actividad | null = null;
  modalAbierto = false;

  abrirDetalle(act: Actividad): void {
    this.actividadSeleccionada = act;
    this.modalAbierto = true;
    if (act.id != null) {
      this.visitaService.registrarActividad(act.id);
    }
  }

  cerrarDetalle(): void {
    this.modalAbierto = false;
    this.actividadSeleccionada = null;
  }

  private mapJsDiaAEnumJava: { [key: number]: DiaSemana } = {
    1: DiaSemana.LUNES,
    2: DiaSemana.MARTES,
    3: DiaSemana.MIERCOLES,
    4: DiaSemana.JUEVES,
    5: DiaSemana.VIERNES,
    6: DiaSemana.SABADO,
    0: DiaSemana.DOMINGO
  };

  constructor(
    private actividadService: ActividadService,
    private visitaService: VisitaService
  ) {}

  ngOnInit(): void {
    this.generarDiasSemana();
    this.cargarActividadesDesdeBackend();
  }

  generarDiasSemana(): void {
    const hoy = new Date();
    const nombresCortos = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁ'];
    const nombresCompletos = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    this.diasSemana = [];
    for (let i = 0; i < 6; i++) {
      const fechaNueva = new Date();
      fechaNueva.setDate(hoy.getDate() + this.offsetDias + i);

      this.diasSemana.push({
        nombreCorto: nombresCortos[fechaNueva.getDay()],
        numero: fechaNueva.getDate(),
        fechaCompleta: fechaNueva,
        labelDiaCompleto: nombresCompletos[fechaNueva.getDay()]
      });
    }
    this.diaSeleccionado = this.diasSemana[0];
    this.fechaCalendario = this.formatearFechaAInput(this.diaSeleccionado.fechaCompleta);
  }

  cargarActividadesDesdeBackend(): void {
    this.actividadService.obtenerActividades().subscribe({
      next: (data) => {
        console.info('[ConectarSanJose] INFO Actividades recibidas:', data.length);
        data.forEach(a => {
          console.log(`  - ${a.titulo} | horarios:`, JSON.stringify(a.horarios));
        });
        this.listaActividades = data;
        this.filtrarActividades();
      },
      error: (err) => {
        console.error('[ConectarSanJose] ERROR Error al conectar con Spring Boot:', err);
        console.error('[ConectarSanJose] ERROR Status:', err.status, 'Mensaje:', err.message);
        if (err.status === 0) {
          console.warn('[ConectarSanJose] WARN Posible problema de CORS o de conexión con el backend.');
        }
      }
    });
  }

  navegarDias(direccion: number): void {
    this.offsetDias += direccion;
    this.generarDiasSemana();
    this.filtrarActividades();
  }

  // Al tocar un botón de la semana (LUN 14, MAR 15...)
  seleccionarDia(dia: DiaAgenda): void {
    this.diaSeleccionado = dia;
    this.fechaCalendario = this.formatearFechaAInput(dia.fechaCompleta);
    this.filtrarActividades();
  }

  alCambiarCalendario(event: any): void {
    const fechaElegidaStr = event.target.value; // "YYYY-MM-DD"
    if (!fechaElegidaStr) return;

    // Crear la fecha evitando problemas de zona horaria
    const [anio, mes, dia] = fechaElegidaStr.split('-').map(Number);
    const fechaElegida = new Date(anio, mes - 1, dia);

    const nombresCompletos = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const nombresCortos = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁ'];

    this.diaSeleccionado = {
      nombreCorto: nombresCortos[fechaElegida.getDay()],
      numero: fechaElegida.getDate(),
      fechaCompleta: fechaElegida,
      labelDiaCompleto: nombresCompletos[fechaElegida.getDay()]
    };

    this.filtrarActividades();
  }

  filtrarActividades(): void {
    const numeroDiaSemanaJs = this.diaSeleccionado.fechaCompleta.getDay();
    const enumDiaJava = this.mapJsDiaAEnumJava[numeroDiaSemanaJs];

    this.actividadesFiltradas = this.listaActividades.filter(actividad => {
      if (!actividad.horarios || actividad.horarios.length === 0) return false;
      return actividad.horarios.some(h => h.diaSemana === enumDiaJava);
    });
  }

  //transforma un objeto Date al formato del HTML "YYYY-MM-DD"
  private formatearFechaAInput(date: Date): string {
    const anio = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
}