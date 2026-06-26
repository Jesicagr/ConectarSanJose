import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadService } from '../../services/actividad.service';
import { VisitaService } from '../../services/visita.service';
import { Actividad, DiaSemana } from '../../models/actividad.model';
import { getPhoneLink, getAddressLink, isUrl } from '../../shared/link-utils';

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

  calendarAbierto = false;
  mesCalendario: number;
  anioCalendario: number;
  nombresMeses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  nombresCortosDias = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁ'];
  nombresCompletosDias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

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
  ) {
    const hoy = new Date();
    this.mesCalendario = hoy.getMonth();
    this.anioCalendario = hoy.getFullYear();
  }

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
    this.actividadService.obtenerTodas().subscribe({
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
    const fechaElegidaStr = event.target.value;
    if (!fechaElegidaStr) return;

    const [anio, mes, dia] = fechaElegidaStr.split('-').map(Number);
    const fechaElegida = new Date(anio, mes - 1, dia);

    this.offsetDias = this.offsetParaFecha(fechaElegida);
    this.generarDiasSemana();

    this.diaSeleccionado = {
      nombreCorto: this.nombresCortosDias[fechaElegida.getDay()],
      numero: fechaElegida.getDate(),
      fechaCompleta: fechaElegida,
      labelDiaCompleto: this.nombresCompletosDias[fechaElegida.getDay()]
    };
    this.fechaCalendario = this.formatearFechaAInput(fechaElegida);
    this.filtrarActividades();
  }

  abrirCalendario(): void {
    this.mesCalendario = this.diaSeleccionado.fechaCompleta.getMonth();
    this.anioCalendario = this.diaSeleccionado.fechaCompleta.getFullYear();
    this.calendarAbierto = !this.calendarAbierto;
  }

  cerrarCalendario(): void {
    this.calendarAbierto = false;
  }

  navegarMes(dir: number): void {
    this.mesCalendario += dir;
    if (this.mesCalendario < 0) { this.mesCalendario = 11; this.anioCalendario--; }
    if (this.mesCalendario > 11) { this.mesCalendario = 0; this.anioCalendario++; }
  }

  diasCalendario(): (number | null)[] {
    const dias: (number | null)[] = [];
    const primerDia = new Date(this.anioCalendario, this.mesCalendario, 1).getDay();
    const diasEnMes = new Date(this.anioCalendario, this.mesCalendario + 1, 0).getDate();
    for (let i = 0; i < primerDia; i++) dias.push(null);
    for (let d = 1; d <= diasEnMes; d++) dias.push(d);
    return dias;
  }

  esDiaSeleccionado(dia: number): boolean {
    const sel = this.diaSeleccionado;
    return dia === sel.numero
      && this.mesCalendario === sel.fechaCompleta.getMonth()
      && this.anioCalendario === sel.fechaCompleta.getFullYear();
  }

  seleccionarDiaCalendario(dia: number): void {
    const fecha = new Date(this.anioCalendario, this.mesCalendario, dia);

    this.offsetDias = this.offsetParaFecha(fecha);
    this.generarDiasSemana();

    this.diaSeleccionado = {
      nombreCorto: this.nombresCortosDias[fecha.getDay()],
      numero: fecha.getDate(),
      fechaCompleta: fecha,
      labelDiaCompleto: this.nombresCompletosDias[fecha.getDay()]
    };
    this.fechaCalendario = this.formatearFechaAInput(fecha);
    this.calendarAbierto = false;
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

  phoneLink(numero: string, wa?: boolean): string {
    return getPhoneLink(numero, wa);
  }

  addressLink(dir: string): string {
    return getAddressLink(dir);
  }

  isUrl(str: string): boolean {
    return isUrl(str);
  }

  private offsetParaFecha(fecha: Date): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const f = new Date(fecha);
    f.setHours(0, 0, 0, 0);
    return Math.round((f.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  }

  //transforma un objeto Date al formato del HTML "YYYY-MM-DD"
  private formatearFechaAInput(date: Date): string {
    const anio = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
}