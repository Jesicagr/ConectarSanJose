import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaComponent } from '../agenda/agenda';
import { AreaComponent } from '../area/area';
import { ContactoService, Contacto } from '../../services/contacto.service';
import { getPhoneLink } from '../../shared/link-utils';

const ICON_MAP: Record<string, { emoji: string; color: string }> = {
  local_police: { emoji: '👮', color: 'azul' },
  fire_extinguisher: { emoji: '🔥', color: 'rojo' },
  medical_services: { emoji: '🚑', color: 'rojo' },
  local_hospital: { emoji: '🏥', color: 'rojo' },
  ambulance: { emoji: '🚑', color: 'rojo' },
  phone_in_talk: { emoji: '📞', color: 'azul' },
  help_center: { emoji: '🆘', color: 'violeta' },
  volunteer_activism: { emoji: '🤝', color: 'verde' },
  water_drop: { emoji: '💧', color: 'azul' },
  electric_bolt: { emoji: '⚡', color: 'amarillo' },
  elderly: { emoji: '👴', color: 'violeta' },
  child_friendly: { emoji: '👶', color: 'rojo' },
  pets: { emoji: '🐾', color: 'verde' },
  gavel: { emoji: '⚖️', color: 'violeta' },
  psychology: { emoji: '🧠', color: 'azul' },
  female: { emoji: '♀️', color: 'violeta' },
};

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, AgendaComponent, AreaComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  menuAbierto: boolean = false;
  mostrarModalAyuda: boolean = false;
  contactosEmergencia: Contacto[] = [];
  whatsappFlotanteNumero: string = '';

  constructor(private contactoService: ContactoService) {}

  ngOnInit(): void {
    this.whatsappFlotanteNumero = this.contactoService.getWhatsappFlotanteNumero();
    this.contactoService.obtenerTodos().subscribe({
      next: (contactos) => {
        this.contactosEmergencia = [...contactos].sort((a, b) => {
          const aHas135 = a.telefonos?.some(t => t.numero === '135');
          const bHas135 = b.telefonos?.some(t => t.numero === '135');
          if (aHas135) return -1;
          if (bHas135) return 1;
          const pa = (a as any).ordenPrioridad;
          const pb = (b as any).ordenPrioridad;
          if (pa != null && pb != null) return pa - pb;
          if (pa != null) return -1;
          if (pb != null) return 1;
          return 0;
        });
      },
      error: () => this.contactosEmergencia = [],
    });
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
    document.body.style.overflow = this.menuAbierto ? 'hidden' : '';
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
    document.body.style.overflow = '';
  }

  irInicio(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  abrirAyuda() {
    this.mostrarModalAyuda = true;
  }

  cerrarAyuda() {
    this.mostrarModalAyuda = false;
  }

  phoneLink(numero: string): string {
    return getPhoneLink(numero);
  }

  contactoEmoji(icono: string): string {
    return ICON_MAP[icono]?.emoji || '📞';
  }

  contactoColor(icono: string): string {
    return ICON_MAP[icono]?.color || 'azul';
  }

  primerTelefono(contacto: Contacto): string {
    return contacto.telefonos?.[0]?.numero || '';
  }
}
