import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Agrega el token a cada petición: Authorization: Bearer <token>
 * El backend lo valida en cada endpoint protegido con AdministradorGuard (RF-03).
 * Si el backend responde 401 (token vencido o inválido), se cierra la sesión.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.obtenerToken();
  const esLogin = req.url.endsWith('/login');
  const esLogout = req.url.endsWith('/logout');

  const peticion =
    token && !esLogin ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !esLogin && !esLogout && token) {
        auth.cerrarSesion('expirada');
      }
      return throwError(() => error);
    }),
  );
};
