import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege el panel (RF-03): sin sesión válida, manda al login
 * y recuerda a qué página quería entrar para volver después.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estaAutenticado()) {
    return true;
  }

  auth.limpiarSesion();
  return router.createUrlTree(['/login'], { queryParams: { volverA: state.url } });
};

/** Evita que alguien con sesión iniciada vuelva a ver el login. */
export const invitadoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.estaAutenticado() ? router.createUrlTree(['/dashboard']) : true;
};
