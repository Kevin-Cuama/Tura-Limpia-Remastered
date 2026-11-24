import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from './dashboard.service';
import { IndicadoresDashboard, PerfilAdministrador, ResultadoIndicadores } from './dashboard.models';

type Icono = 'ok' | 'transito' | 'taller' | 'detenido' | 'inactivo' | 'pausa';

interface ParteEstado {
  etiqueta: string;
  valor: number;
  color: string;
  icono: Icono;
  textoOscuro?: boolean; // ícono oscuro sobre fondos claros (amarillo)
}

interface GrupoIndicadores {
  clave: string;
  titulo: string;
  total: number;
  unidad: string;
  enlace: string;
  partes: ParteEstado[];
  extra?: { etiqueta: string; valor: number };
}

const COLOR = {
  bien: 'var(--estado-bien)',
  transito: 'var(--estado-transito)',
  alerta: 'var(--estado-alerta)',
  critico: 'var(--estado-critico)',
  neutro: 'var(--estado-neutro)',
};

/**
 * Dashboard administrativo (RF-19): indicadores de vehículos, conductores y rutas,
 * y accesos a los módulos del sistema.
 */
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly servicio = inject(DashboardService);
  private readonly auth = inject(AuthService);

  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly resultado = signal<ResultadoIndicadores | null>(null);
  readonly perfil = signal<PerfilAdministrador | null>(null);

  readonly nombre = computed(
    () => this.perfil()?.nombre ?? this.auth.administrador()?.nombre ?? 'administrador',
  );

  readonly saludo = computed(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Buenos días';
    if (hora >= 12 && hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  });

  readonly grupos = computed<GrupoIndicadores[]>(() => {
    const r = this.resultado();
    return r ? armarGrupos(r.datos) : [];
  });

  readonly modulos = [
    { ruta: '/vehiculos', nombre: 'Vehículos', descripcion: 'Registra los vehículos y actualiza su estado operativo.' },
    { ruta: '/conductores', nombre: 'Conductores', descripcion: 'Datos, licencia y estado de cada conductor.' },
    { ruta: '/barrios', nombre: 'Barrios y sectores', descripcion: 'Los sectores de Buenaventura que atiende el servicio.' },
    { ruta: '/rutas', nombre: 'Rutas', descripcion: 'Crea rutas y traza su recorrido en el mapa.' },
    { ruta: '/turnos', nombre: 'Turnos', descripcion: 'Hora de inicio y de fin de cada jornada.' },
    { ruta: '/programacion', nombre: 'Programación', descripcion: 'Asigna vehículo, conductor y turno a cada ruta.' },
  ];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    forkJoin({
      perfil: this.servicio.obtenerPerfil(),
      indicadores: this.servicio.obtenerIndicadores(),
    }).subscribe({
      next: ({ perfil, indicadores }) => {
        this.perfil.set(perfil);
        this.resultado.set(indicadores);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(AuthService.mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }

  /** Texto para lectores de pantalla que describe la barra de estados. */
  describir(grupo: GrupoIndicadores): string {
    const partes = grupo.partes.map((p) => `${p.valor} ${p.etiqueta.toLowerCase()}`).join(', ');
    return `${grupo.total} ${grupo.unidad}: ${partes}`;
  }

  porcentaje(parte: ParteEstado, grupo: GrupoIndicadores): number {
    return grupo.total > 0 ? Math.round((parte.valor / grupo.total) * 100) : 0;
  }
}

function armarGrupos(d: IndicadoresDashboard): GrupoIndicadores[] {
  return [
    {
      clave: 'vehiculos',
      titulo: 'Vehículos',
      total: d.vehiculos.total,
      unidad: d.vehiculos.total === 1 ? 'vehículo registrado' : 'vehículos registrados',
      enlace: '/vehiculos',
      partes: [
        { etiqueta: 'Disponibles', valor: d.vehiculos.disponibles, color: COLOR.bien, icono: 'ok' },
        { etiqueta: 'En servicio', valor: d.vehiculos.enServicio, color: COLOR.transito, icono: 'transito' },
        { etiqueta: 'En mantenimiento', valor: d.vehiculos.mantenimiento, color: COLOR.alerta, icono: 'taller', textoOscuro: true },
        { etiqueta: 'Fuera de servicio', valor: d.vehiculos.fueraDeServicio, color: COLOR.critico, icono: 'detenido' },
      ],
    },
    {
      clave: 'conductores',
      titulo: 'Conductores',
      total: d.conductores.total,
      unidad: d.conductores.total === 1 ? 'conductor registrado' : 'conductores registrados',
      enlace: '/conductores',
      partes: [
        { etiqueta: 'Activos', valor: d.conductores.activos, color: COLOR.bien, icono: 'ok' },
        { etiqueta: 'Inactivos', valor: d.conductores.inactivos, color: COLOR.neutro, icono: 'inactivo' },
      ],
    },
    {
      clave: 'rutas',
      titulo: 'Rutas',
      total: d.rutas.total,
      unidad: d.rutas.total === 1 ? 'ruta creada' : 'rutas creadas',
      enlace: '/rutas',
      partes: [
        { etiqueta: 'Activas', valor: d.rutas.activas, color: COLOR.bien, icono: 'ok' },
        { etiqueta: 'Suspendidas', valor: d.rutas.suspendidas, color: COLOR.alerta, icono: 'pausa', textoOscuro: true },
      ],
      extra: { etiqueta: 'Con servicio programado', valor: d.rutas.programadas },
    },
  ];
}
