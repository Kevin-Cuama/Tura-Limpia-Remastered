import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IndicadoresDashboard,
  PerfilAdministrador,
  ResultadoIndicadores,
} from './dashboard.models';

// Datos de ejemplo mientras el backend no tenga el endpoint de indicadores.
// Cuando exista GET /api/v1/dashboard/indicadores, se usan los datos reales automáticamente.
const INDICADORES_EJEMPLO: IndicadoresDashboard = {
  vehiculos: { total: 18, disponibles: 9, enServicio: 5, mantenimiento: 3, fueraDeServicio: 1 },
  conductores: { total: 24, activos: 21, inactivos: 3 },
  rutas: { total: 14, activas: 12, suspendidas: 2, programadas: 10 },
};

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  /**
   * Perfil del administrador. Es una ruta protegida del backend,
   * así que sirve también para comprobar que el token sigue siendo válido (RF-03).
   */
  obtenerPerfil(): Observable<PerfilAdministrador> {
    return this.http.get<PerfilAdministrador>(`${this.api}/administrador/perfil`);
  }

  obtenerIndicadores(): Observable<ResultadoIndicadores> {
    return this.http.get<IndicadoresDashboard>(`${this.api}/dashboard/indicadores`).pipe(
      map((datos) => ({ datos, origen: 'backend' as const })),
      catchError((error: HttpErrorResponse) => {
        // 404 = el endpoint todavía no existe en el backend → datos de ejemplo
        if (error.status === 404) {
          return of({ datos: INDICADORES_EJEMPLO, origen: 'ejemplo' as const });
        }
        return throwError(() => error);
      }),
    );
  }
}
