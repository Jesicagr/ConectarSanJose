import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadService } from '../../services/actividad.service';
import { VisitaService } from '../../services/visita.service';
import { Actividad } from '../../models/actividad.model';
import { getPhoneLink, getAddressLink, isUrl } from '../../shared/link-utils';
import { getAreaTone, TONE_HEX } from '../../shared/area-tones';

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
  
  actividades: Actividad[] = [];
  cargandoActividades = false;
  renderCount = 5;
  readonly PAGE_SIZE = 5;

  get actividadesMostradas(): Actividad[] {
    return this.actividades.slice(0, this.renderCount);
  }

  get hayMasActividades(): boolean {
    return this.renderCount < this.actividades.length;
  }

  cargarMas(): void {
    this.renderCount += this.PAGE_SIZE;
  }

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

  private mapJsDiaAString: { [key: number]: string } = {
    1: 'LUNES', 2: 'MARTES', 3: 'MIERCOLES',
    4: 'JUEVES', 5: 'VIERNES', 6: 'SABADO', 0: 'DOMINGO'
  };

  cargarActividadesDelDia(): void {
    this.cargandoActividades = true;
    const diaStr = this.mapJsDiaAString[this.diaSeleccionado.fechaCompleta.getDay()];
    this.actividadService.obtenerPorDiaSemana(diaStr).subscribe({
      next: (data) => {
        this.actividades = data;
        this.renderCount = this.PAGE_SIZE;
        this.cargandoActividades = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[ConectarSanJose] ERROR Error al cargar actividades del día:', err);
        this.actividades = [];
        this.cargandoActividades = false;
        this.cdr.detectChanges();
      }
    });
  }

  constructor(
    private actividadService: ActividadService,
    private visitaService: VisitaService,
    private cdr: ChangeDetectorRef
  ) {
    const hoy = new Date();
    this.mesCalendario = hoy.getMonth();
    this.anioCalendario = hoy.getFullYear();
  }

  ngOnInit(): void {
    this.generarDiasSemana();
    this.cargarActividadesDelDia();
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

  navegarDias(direccion: number): void {
    this.offsetDias += direccion;
    this.generarDiasSemana();
    this.cargarActividadesDelDia();
  }

  // Al tocar un botón de la semana (LUN 14, MAR 15...)
  seleccionarDia(dia: DiaAgenda): void {
    this.diaSeleccionado = dia;
    this.fechaCalendario = this.formatearFechaAInput(dia.fechaCompleta);
    this.cargarActividadesDelDia();
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
    this.cargarActividadesDelDia();
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
    this.cargarActividadesDelDia();
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

  getAreaColor(act: Actividad): string {
    const area = act.areas?.[0];
    if (!area) return '#dfeceb';
    const tone = getAreaTone(area.nombre, area.id ?? 0);
    return TONE_HEX[tone] || '#dfeceb';
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