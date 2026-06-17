import { Component } from '@angular/core';
import { AgendaComponent } from '../agenda/agenda';
import { AreaComponent } from '../area/area';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [AgendaComponent, AreaComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  mostrarModalAyuda: boolean = false;
  menuAbierto: boolean = false;

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

  mostrarMujeres() {}
  mostrarNinez() {}
  mostrarMayores() {}
  mostrarComunidad() {}
  mostrarDiscapacidad() {}
  mostrarSalud() {}
  mostrarTrabajo() {}
  mostrarDeportes() {}
  mostrarTurismo() {}
  mostrarCultura() {}
  mostrarEducacion() {}
}
