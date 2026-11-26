import { describe, expect, it } from 'vitest';
import { diaDeLaSemana, horaEnColombia, horariosSeCruzan, hoyEnColombia } from './fechas.util.js';

describe('Utilidades de fechas', () => {
  it('calcula el día de la semana de una fecha', () => {
    expect(diaDeLaSemana('2026-11-23')).toBe('LUNES');
    expect(diaDeLaSemana('2026-11-29')).toBe('DOMINGO');
    expect(diaDeLaSemana('2026-12-02')).toBe('MIERCOLES');
  });

  it('usa la hora de Colombia, no la del servidor', () => {
    // 2026-11-25 03:00 UTC = 2026-11-24 22:00 en Bogotá
    const instante = new Date('2026-11-25T03:00:00Z');
    expect(hoyEnColombia(instante)).toBe('2026-11-24');
    expect(horaEnColombia(instante)).toBe('22:00');
  });

  it('detecta cuando dos horarios se cruzan', () => {
    const manana = { horaInicio: '06:00', horaFin: '14:00' };
    expect(horariosSeCruzan(manana, { horaInicio: '13:00', horaFin: '15:00' })).toBe(true);
    expect(horariosSeCruzan(manana, { horaInicio: '08:00', horaFin: '10:00' })).toBe(true);
  });

  it('un turno que empieza justo cuando termina el otro no se cruza', () => {
    expect(
      horariosSeCruzan({ horaInicio: '06:00', horaFin: '14:00' }, { horaInicio: '14:00', horaFin: '22:00' }),
    ).toBe(false);
  });
});
