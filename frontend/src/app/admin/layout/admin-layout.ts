import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ToastService } from '../../shared/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  sidebarOpen = false;
  toast$ = inject(ToastService).toast$;
  auth = inject(AuthService);

  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Actividades', icon: 'calendar_today', route: '/admin/activities' },
    { label: 'Sedes', icon: 'location_on', route: '/admin/sedes' },
    { label: 'Áreas', icon: 'apartment', route: '/admin/areas' },
    { label: 'Contactos', icon: 'contacts', route: '/admin/contactos' },
  ];

  get navItemsAll() {
    const usuarios = { label: 'Usuarios', icon: 'manage_accounts', route: '/admin/usuarios' };
    return this.auth.isSuperAdmin() ? [...this.navItems, usuarios] : this.navItems;
  }

  get userEmail(): string {
    return this.auth.getUser()?.email ?? 'Admin';
  }

  get userRol(): string {
    const rol = this.auth.getRol();
    return rol === 'SUPER_ADMIN' ? 'Superusuario' : 'Administrador';
  }

  openSidebar(): void {
    this.sidebarOpen = true;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  private toastService = inject(ToastService);
  hideToast(): void {
    this.toastService.hide();
  }
}
