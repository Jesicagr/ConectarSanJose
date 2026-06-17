import { Component } from '@angular/core';
import { AgendaComponent } from './components/agenda/agenda';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgendaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'conectar-angular';

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
}