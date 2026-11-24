import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';

export interface EnlaceMenu {
  ruta: string;
  texto: string;
}

/**
 * Estructura común del panel: menú lateral + barra superior.
 * El botón "Cerrar sesión" vive aquí, así está disponible en todas las pantallas (RF-02).
 */
@Component({
  selector: 'app-panel-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './panel-layout.html',
  styleUrl: './panel-layout.scss',
})
export class PanelLayout {
  private readonly auth = inject(AuthService);

  readonly administrador = this.auth.administrador;
  readonly hoy = new Date();
  readonly menuAbierto = signal(false);

  // El menú se dibuja como una ruta: cada módulo es una parada
  readonly enlaces: EnlaceMenu[] = [
    { ruta: '/dashboard', texto: 'Panel' },
    { ruta: '/vehiculos', texto: 'Vehículos' },
    { ruta: '/conductores', texto: 'Conductores' },
    { ruta: '/barrios', texto: 'Barrios y sectores' },
    { ruta: '/rutas', texto: 'Rutas' },
    { ruta: '/turnos', texto: 'Turnos' },
    { ruta: '/programacion', texto: 'Programación' },
  ];

  constructor() {
    // En celular, cerrar el menú al cambiar de página
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuAbierto.set(false));
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
  }
}
