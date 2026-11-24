import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Administrador, CredencialesLogin, ErrorApi, RespuestaLogin } from '../models/auth.models';

const CLAVE_TOKEN = 'tura_token';
const CLAVE_ADMIN = 'tura_admin';

/**
 * Maneja la sesión del administrador (RF-01, RF-02, RF-03).
 * - Inicia sesión contra el backend y guarda el token JWT.
 * - Expone el administrador actual como signal para que las pantallas reaccionen.
 * - Cierra la sesión borrando el token.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly token = signal<string | null>(localStorage.getItem(CLAVE_TOKEN));
  private readonly admin = signal<Administrador | null>(leerAdminGuardado());

  /** Administrador con sesión iniciada (o null). */
  readonly administrador = this.admin.asReadonly();

  /** true si hay un token y todavía no ha vencido. */
  readonly estaAutenticado = computed(() => {
    const token = this.token();
    return token !== null && !tokenVencido(token);
  });

  obtenerToken(): string | null {
    return this.token();
  }

  iniciarSesion(credenciales: CredencialesLogin): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(`${environment.apiUrl}/login`, credenciales).pipe(
      tap((respuesta) => {
        localStorage.setItem(CLAVE_TOKEN, respuesta.token);
        localStorage.setItem(CLAVE_ADMIN, JSON.stringify(respuesta.administrador));
        this.token.set(respuesta.token);
        this.admin.set(respuesta.administrador);
      }),
    );
  }

  /**
   * Cierra la sesión. El backend no guarda sesiones (JWT sin estado),
   * así que lo importante es borrar el token del navegador.
   * Igual se avisa al backend con POST /logout por si más adelante registra la salida.
   */
  cerrarSesion(motivo?: 'expirada'): void {
    if (this.token()) {
      this.http.post(`${environment.apiUrl}/logout`, {}).subscribe({ error: () => {} });
    }
    this.limpiarSesion();
    this.router.navigate(['/login'], {
      queryParams: motivo ? { motivo } : {},
    });
  }

  /** Borra los datos de sesión sin navegar (lo usa el interceptor ante un 401). */
  limpiarSesion(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_ADMIN);
    this.token.set(null);
    this.admin.set(null);
  }

  /** Convierte cualquier error HTTP en un mensaje claro para mostrar en pantalla. */
  static mensajeDeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'No se pudo conectar con el servidor. Revisa que el backend esté encendido e intenta de nuevo.';
      }
      const cuerpo = error.error as Partial<ErrorApi> | null;
      const mensaje = cuerpo?.message;
      if (Array.isArray(mensaje) && mensaje.length > 0) {
        return mensaje.join(' ');
      }
      if (typeof mensaje === 'string' && mensaje.length > 0) {
        return mensaje;
      }
      if (error.status >= 500) {
        return 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.';
      }
    }
    return 'Ocurrió un error inesperado. Intenta de nuevo.';
  }
}

function leerAdminGuardado(): Administrador | null {
  try {
    const guardado = localStorage.getItem(CLAVE_ADMIN);
    return guardado ? (JSON.parse(guardado) as Administrador) : null;
  } catch {
    return null;
  }
}

/** Lee la fecha de vencimiento (exp) que viene dentro del JWT. */
export function tokenVencido(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
