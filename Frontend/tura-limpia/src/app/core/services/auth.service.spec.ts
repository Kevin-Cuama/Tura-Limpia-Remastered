import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService, tokenVencido } from './auth.service';

/** Arma un JWT de prueba con la fecha de vencimiento indicada (en segundos desde ahora). */
function crearToken(venceEnSegundos: number): string {
  const codificar = (obj: object) => btoa(JSON.stringify(obj)).replace(/=+$/, '');
  const exp = Math.floor(Date.now() / 1000) + venceEnSegundos;
  return `${codificar({ alg: 'HS256' })}.${codificar({ idUsuario: 1, rol: 'ADMINISTRADOR', exp })}.firma`;
}

describe('AuthService', () => {
  let servicio: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    servicio = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('guarda el token y el administrador al iniciar sesión', () => {
    const token = crearToken(3600);
    servicio.iniciarSesion({ correo: 'admin@turalimpia.com', contrasena: 'Admin123*' }).subscribe();

    const peticion = http.expectOne('/api/v1/login');
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({ correo: 'admin@turalimpia.com', contrasena: 'Admin123*' });
    peticion.flush({
      mensaje: 'Bienvenido administrador',
      token,
      administrador: { id: 1, nombre: 'Administrador', correo: 'admin@turalimpia.com' },
    });

    expect(servicio.estaAutenticado()).toBe(true);
    expect(servicio.administrador()?.nombre).toBe('Administrador');
    expect(localStorage.getItem('tura_token')).toBe(token);
  });

  it('borra la sesión al cerrarla', () => {
    localStorage.setItem('tura_token', crearToken(3600));
    servicio.limpiarSesion();
    expect(servicio.estaAutenticado()).toBe(false);
    expect(localStorage.getItem('tura_token')).toBeNull();
  });

  it('detecta tokens vencidos', () => {
    expect(tokenVencido(crearToken(3600))).toBe(false);
    expect(tokenVencido(crearToken(-10))).toBe(true);
    expect(tokenVencido('esto-no-es-un-token')).toBe(true);
  });

  it('muestra el mensaje que envía el backend', () => {
    const error = new HttpErrorResponse({
      status: 401,
      error: { message: 'Correo o contraseña incorrectos.', statusCode: 401 },
    });
    expect(AuthService.mensajeDeError(error)).toBe('Correo o contraseña incorrectos.');
  });

  it('explica cuando el backend no responde', () => {
    const error = new HttpErrorResponse({ status: 0 });
    expect(AuthService.mensajeDeError(error)).toContain('No se pudo conectar con el servidor');
  });
});
