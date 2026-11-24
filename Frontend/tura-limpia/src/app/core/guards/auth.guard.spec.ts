import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { authGuard, invitadoGuard } from './auth.guard';

function crearToken(venceEnSegundos: number): string {
  const codificar = (obj: object) => btoa(JSON.stringify(obj)).replace(/=+$/, '');
  const exp = Math.floor(Date.now() / 1000) + venceEnSegundos;
  return `${codificar({ alg: 'HS256' })}.${codificar({ exp })}.firma`;
}

function ejecutar(guard: typeof authGuard, url = '/dashboard') {
  return TestBed.runInInjectionContext(() =>
    guard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
  );
}

describe('Guards de sesión', () => {
  function configurar() {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
  }

  beforeEach(() => localStorage.clear());

  it('sin sesión, manda al login recordando la página pedida', () => {
    configurar();
    const resultado = ejecutar(authGuard, '/rutas') as UrlTree;
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(resultado)).toBe('/login?volverA=%2Frutas');
  });

  it('con un token vencido, también manda al login', () => {
    localStorage.setItem('tura_token', crearToken(-60));
    configurar();
    expect(ejecutar(authGuard)).toBeInstanceOf(UrlTree);
  });

  it('con sesión válida, deja entrar al panel', () => {
    localStorage.setItem('tura_token', crearToken(3600));
    configurar();
    expect(ejecutar(authGuard)).toBe(true);
  });

  it('con sesión válida, el login redirige al dashboard', () => {
    localStorage.setItem('tura_token', crearToken(3600));
    configurar();
    const resultado = ejecutar(invitadoGuard) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(resultado)).toBe('/dashboard');
  });
});
