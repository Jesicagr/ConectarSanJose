import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactoService, Contacto } from '../../../services/contacto.service';
import { ToastService } from '../../../shared/toast.service';
import { LoggerService } from '../../../shared/logger.service';

interface PhoneItem {
  numero: string;
  esWhatsapp: boolean;
}

interface ContactCard {
  name: string;
  description: string;
  phones: PhoneItem[];
  icon: string;
  tone: string;
  category: string;
}

const TONES = ['primary', 'danger', 'warning', 'rose', 'lavender', 'peach', 'cyan', 'amber'];

@Component({
  selector: 'app-contacts-page',
  imports: [FormsModule],
  templateUrl: './contacts-page.html',
  styleUrl: './contacts-page.css',
})
export class ContactsPage implements OnInit {
  private contactoService = inject(ContactoService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);
  private logger = inject(LoggerService);

  loading = true;
  isModalOpen = false;
  editId: number | null = null;
  saving = false;
  whatsappFlotanteNumero = '';
  whatsappFlotanteLabel = '';

  iconos = [
    { icono: 'local_police', label: 'Policía' },
    { icono: 'fire_extinguisher', label: 'Bomberos' },
    { icono: 'medical_services', label: 'Salud' },
    { icono: 'water_drop', label: 'Agua' },
    { icono: 'electric_bolt', label: 'Electricidad' },
    { icono: 'phone_in_talk', label: 'Teléfono' },
    { icono: 'help_center', label: 'Ayuda' },
    { icono: 'local_hospital', label: 'Hospital' },
    { icono: 'ambulance', label: 'Ambulancia' },
    { icono: 'volunteer_activism', label: 'Voluntariado' },
    { icono: 'elderly', label: 'Adulto Mayor' },
    { icono: 'child_friendly', label: 'Infancia' },
    { icono: 'pets', label: 'Animales' },
    { icono: 'gavel', label: 'Justicia' },
  ];

  newContact: { nombreInstitucion: string; telefonos: PhoneItem[]; descripcion: string; icono: string; categoria: string } = {
    nombreInstitucion: '',
    telefonos: [{ numero: '', esWhatsapp: false }],
    descripcion: '',
    icono: '',
    categoria: '',
  };

  contacts: ContactCard[] = [];
  private contactsBackend: Contacto[] = [];

  ngOnInit(): void {
    this.whatsappFlotanteNumero = this.contactoService.getWhatsappFlotanteNumero();
    this.whatsappFlotanteLabel = this.contactoService.getWhatsappFlotanteLabel();
    this.contactoService.obtenerTodos().subscribe({
      next: (data) => {
        this.contactsBackend = data;
        this.contacts = data.map((c, i) => this.toContactCard(c, i));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.logger.error('Error al cargar contactos', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private toContactCard(c: Contacto, index: number): ContactCard {
    return {
      name: c.nombreInstitucion,
      description: c.descripcion,
      phones: c.telefonos || [],
      icon: c.icono,
      tone: TONES[index % TONES.length],
      category: c.categoria || 'Servicios',
    };
  }
  openModal(): void {
    this.editId = null;
    this.newContact = { nombreInstitucion: '', telefonos: [{ numero: '', esWhatsapp: false }], descripcion: '', icono: '', categoria: '' };
    this.isModalOpen = true;
  }

  editarContacto(index: number): void {
    const backend = this.contactsBackend[index];
    if (!backend) return;
    this.editId = backend.id;
    this.newContact = {
      nombreInstitucion: backend.nombreInstitucion,
      telefonos: (backend.telefonos && backend.telefonos.length > 0)
        ? backend.telefonos.map(t => ({ numero: t.numero, esWhatsapp: t.esWhatsapp }))
        : [{ numero: '', esWhatsapp: false }],
      descripcion: backend.descripcion || '',
      icono: backend.icono || '',
      categoria: backend.categoria || '',
    };
    this.isModalOpen = true;
  }

  onOverlayMouseDown(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editId = null;
  }

  selectIcon(icono: string): void {
    this.newContact.icono = icono;
  }

  addTelefono(): void {
    this.newContact.telefonos.push({ numero: '', esWhatsapp: false });
  }

  removeTelefono(index: number): void {
    if (this.newContact.telefonos.length > 1) {
      this.newContact.telefonos.splice(index, 1);
    }
  }

  saveContact(): void {
    if (!this.newContact.nombreInstitucion.trim()) {
      this.toast.show('Completa el nombre de la institución', 'error');
      return;
    }

    const validPhones = this.newContact.telefonos.filter(t => t.numero.trim());
    if (validPhones.length === 0) {
      this.toast.show('Agrega al menos un número de teléfono', 'error');
      return;
    }

    this.saving = true;
    const payload: Partial<Contacto> = {
      nombreInstitucion: this.newContact.nombreInstitucion,
      telefonos: validPhones,
      descripcion: this.newContact.descripcion,
      icono: this.newContact.icono,
      categoria: this.newContact.categoria,
    };

    if (this.editId !== null) {
      this.contactoService.actualizar(this.editId, payload).subscribe({
        next: (updated) => {
          const idx = this.contactsBackend.findIndex((c) => c.id === this.editId);
          if (idx !== -1) {
            this.contactsBackend[idx] = updated;
            this.contacts[idx] = this.toContactCard(updated, idx);
          }
          this.closeModal();
          this.saving = false;
          this.cdr.detectChanges();
          this.toast.show('Contacto actualizado con éxito', 'success');
        },
        error: (err) => {
          this.logger.error('Error al actualizar contacto', err);
          this.saving = false;
          this.toast.show('Error al actualizar el contacto', 'error');
        },
      });
    } else {
      this.contactoService.crear(payload).subscribe({
        next: (saved) => {
          this.contactsBackend.push(saved);
          this.contacts.push(this.toContactCard(saved, this.contacts.length));
          this.closeModal();
          this.saving = false;
          this.cdr.detectChanges();
          this.toast.show('Contacto creado con éxito', 'success');
        },
        error: (err) => {
          this.logger.error('Error al crear contacto', err);
          this.saving = false;
          this.toast.show('Error al crear el contacto', 'error');
        },
      });
    }
  }

  confirmarEliminarContacto(index: number): void {
    const backend = this.contactsBackend[index];
    if (!backend) return;
    const name = backend.nombreInstitucion;
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;

    this.toast.show('Eliminando contacto…', 'info');
    this.contactoService.eliminar(backend.id).subscribe({
      next: () => {
        this.contactsBackend.splice(index, 1);
        this.contacts.splice(index, 1);
        this.cdr.detectChanges();
        this.toast.show('Contacto eliminado con éxito', 'success');
      },
      error: (err) => {
        this.logger.error('Error al eliminar contacto', err);
        this.toast.show('Error al eliminar el contacto', 'error');
      },
    });
  }

  private normalize(value: string): string {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  soloNumeros(value: string): string {
    return value.replace(/\D/g, '');
  }

  onWhatsappFlotanteChange(): void {
    this.contactoService.setWhatsappFlotanteNumero(this.whatsappFlotanteNumero);
  }

  onWhatsappFlotanteLabelChange(): void {
    this.contactoService.setWhatsappFlotanteLabel(this.whatsappFlotanteLabel);
  }

  get whatsappHabilitado(): boolean {
    return this.whatsappFlotanteNumero.length >= 6;
  }

  deshabilitarWhatsapp(): void {
    this.whatsappFlotanteNumero = '';
    this.onWhatsappFlotanteChange();
  }

  get filteredContacts(): ContactCard[] {
    return this.contacts;
  }
}
