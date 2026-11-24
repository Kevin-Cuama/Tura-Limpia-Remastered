import { Routes } from '@angular/router';
import { authGuard, invitadoGuard } from './core/guards/auth.guard';

// Módulos que todavía no se construyen: muestran una página "en construcción"
// para que el menú y los accesos del dashboard (RF-19) ya funcionen.
const modulosPendientes = [
  { path: 'vehiculos', titulo: 'Vehículos', requisitos: 'RF-05 y RF-06' },
  { path: 'conductores', titulo: 'Conductores', requisitos: 'RF-07 y RF-08' },
  { path: 'barrios', titulo: 'Barrios y sectores', requisitos: 'RF-09' },
  { path: 'rutas', titulo: 'Rutas', requisitos: 'RF-10 a RF-13' },
  { path: 'turnos', titulo: 'Turnos', requisitos: 'RF-14' },
  { path: 'programacion', titulo: 'Programación', requisitos: 'RF-15 a RF-18' },
];

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [invitadoGuard],
    title: 'Iniciar sesión | Tura Limpia',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    // Todo lo que está aquí adentro exige sesión iniciada (RF-03)
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/panel-layout/panel-layout').then((m) => m.PanelLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Panel | Tura Limpia',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      ...modulosPendientes.map((modulo) => ({
        path: modulo.path,
        title: `${modulo.titulo} | Tura Limpia`,
        data: { titulo: modulo.titulo, requisitos: modulo.requisitos },
        loadComponent: () =>
          import('./features/modulo-pendiente/modulo-pendiente').then((m) => m.ModuloPendiente),
      })),
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
