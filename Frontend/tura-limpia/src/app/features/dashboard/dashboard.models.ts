/**
 * Indicadores del dashboard (RF-19).
 *
 * Contrato propuesto para el backend: GET /api/v1/dashboard/indicadores
 * (protegido con AdministradorGuard) debería responder exactamente esta forma.
 * Mientras ese endpoint no exista, el frontend muestra datos de ejemplo.
 */
export interface IndicadoresDashboard {
  vehiculos: {
    total: number;
    disponibles: number;
    enServicio: number;
    mantenimiento: number;
    fueraDeServicio: number;
  };
  conductores: {
    total: number;
    activos: number;
    inactivos: number;
  };
  rutas: {
    total: number;
    activas: number;
    suspendidas: number;
    programadas: number;
  };
}

/** De dónde salieron los datos que se están mostrando. */
export type OrigenDatos = 'backend' | 'ejemplo';

export interface ResultadoIndicadores {
  datos: IndicadoresDashboard;
  origen: OrigenDatos;
}

/** Perfil que devuelve GET /api/v1/administrador/perfil */
export interface PerfilAdministrador {
  id: number;
  nombre: string;
  correo: string;
  createdAt: string;
  updatedAt: string;
}
