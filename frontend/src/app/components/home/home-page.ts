import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaComponent } from '../agenda/agenda';
import { AreaComponent } from '../area/area';
import { ContactoService, Contacto } from '../../services/contacto.service';
import { InstagramService, InstagramPost } from '../../services/instagram.service';
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

interface InstaAccount {
  label: string;
  username: string;
  url: string;
  post?: InstagramPost;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, AgendaComponent, AreaComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  menuAbierto: boolean = false;
  mostrarModalAyuda: boolean = false;
  contactosEmergencia: Contacto[] = [];
  whatsappFlotanteNumero: string = '';
  whatsappFlotanteLabel: string = '';
  currentSlide: number = 0;
  instagramPostsLoaded: boolean = false;
  private carouselTimer: any;

  instagramAccounts: InstaAccount[] = [
    { label: 'Municipalidad', username: 'munisanjoseer', url: 'https://www.instagram.com/munisanjoseer' },
    { label: 'Mujeres, Género y Diversidad', username: 'sjmujeresgenerodiversidad', url: 'https://www.instagram.com/sjmujeresgenerodiversidad' },
    { label: 'Salud y Bienestar Social', username: 'sjsaludybienestarsocial', url: 'https://www.instagram.com/sjsaludybienestarsocial' },
    { label: 'Área de Inclusión', username: 'sjareadeinclusion', url: 'https://www.instagram.com/sjareadeinclusion' },
    { label: 'CAPS San José', username: 'caps.sjciudad', url: 'https://www.instagram.com/caps.sjciudad' },
    { label: 'Deportes', username: 'sjdeportes', url: 'https://www.instagram.com/sjdeportes' },
    { label: 'Turismo', username: 'turismosanjose', url: 'https://www.instagram.com/turismosanjose' },
    { label: 'Cultura', username: 'sjcultura_', url: 'https://www.instagram.com/sjcultura_' },
    { label: 'Educación', username: 'sjeducacion', url: 'https://www.instagram.com/sjeducacion' },
    { label: 'Área de Juventudes', username: 'sjareadejuventudes', url: 'https://www.instagram.com/sjareadejuventudes' },
  ];

  constructor(
    private contactoService: ContactoService,
    private instagramService: InstagramService,
  ) {}

  ngOnInit(): void {
    this.whatsappFlotanteNumero = this.contactoService.getWhatsappFlotanteNumero();
    this.whatsappFlotanteLabel = this.contactoService.getWhatsappFlotanteLabel();
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
    this.cargarPosts();
  }

  private cargarPosts(): void {
    this._loadingPosts();
  }

  private _loadingPosts(): void {
    this.instagramService.obtenerPosts().subscribe({
      next: (posts) => {
        const latestPerAccount = new Map<string, InstagramPost>();
        for (const post of posts) {
          const existing = latestPerAccount.get(post.username);
          if (!existing || post.postTimestamp > existing.postTimestamp) {
            latestPerAccount.set(post.username, post);
          }
        }
        if (latestPerAccount.size === 0) {
          setTimeout(() => this._loadingPosts(), 5000);
          return;
        }
        for (const account of this.instagramAccounts) {
          const post = latestPerAccount.get(account.username);
          if (post) account.post = post;
        }
        this.instagramPostsLoaded = true;
      },
      error: () => {
        setTimeout(() => this._loadingPosts(), 5000);
      },
    });
  }

  ngAfterViewInit(): void {
    this.carouselTimer = setInterval(() => this.nextSlide(), 6000);
  }

  ngOnDestroy(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
  }

  nextSlide(): void {
    this.currentSlide = this.currentSlide >= 1 ? 0 : this.currentSlide + 1;
    this.resetCarouselTimer();
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide <= 0 ? 1 : this.currentSlide - 1;
    this.resetCarouselTimer();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetCarouselTimer();
  }

  private resetCarouselTimer(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
    this.carouselTimer = setInterval(() => this.nextSlide(), 6000);
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
