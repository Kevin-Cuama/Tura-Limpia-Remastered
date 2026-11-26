/**
 * Utilidades de fechas. Todas las fechas de negocio (programaciones, servicios
 * del día) se manejan como texto 'AAAA-MM-DD' en hora de Colombia, para no
 * depender de la zona horaria del servidor donde se despliegue el backend.
 */

export const DIAS_SEMANA = [
  'DOMINGO',
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
] as const;

export type DiaSemana = (typeof DIAS_SEMANA)[number];

const ZONA = 'America/Bogota';

/** Fecha de hoy en Colombia, como 'AAAA-MM-DD'. */
export function hoyEnColombia(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(ahora);
}

/** Hora actual en Colombia como 'HH:mm'. */
export function horaEnColombia(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONA,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(ahora);
}

/** Día de la semana de una fecha 'AAAA-MM-DD' (LUNES, MARTES…). */
export function diaDeLaSemana(fecha: string): DiaSemana {
  const [a, m, d] = fecha.split('-').map(Number);
  return DIAS_SEMANA[new Date(Date.UTC(a, m - 1, d)).getUTCDay()];
}

/** '06:00:00' → '06:00' */
export function horaCorta(hora: string): string {
  return hora.slice(0, 5);
}

/** '06:30' → 390 (minutos desde medianoche) */
export function aMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

/** true si los rangos [inicioA, finA) y [inicioB, finB) se cruzan. */
export function horariosSeCruzan(
  a: { horaInicio: string; horaFin: string },
  b: { horaInicio: string; horaFin: string },
): boolean {
  return (
    aMinutos(a.horaInicio) < aMinutos(b.horaFin) &&
    aMinutos(b.horaInicio) < aMinutos(a.horaFin)
  );
}
