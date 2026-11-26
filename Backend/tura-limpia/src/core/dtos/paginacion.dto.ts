import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

/**
 * Parámetros de paginación comunes a todos los listados:
 *   GET /api/v1/vehiculos?paginaActual=1&paginasRegistro=10&buscar=TLA
 * (los nombres vienen de la colección de Postman del proyecto).
 */
export class PaginacionDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'paginaActual debe ser un número entero.' })
  @Min(1, { message: 'paginaActual debe ser 1 o mayor.' })
  paginaActual: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'paginasRegistro debe ser un número entero.' })
  @Min(1, { message: 'paginasRegistro debe ser 1 o mayor.' })
  @Max(100, { message: 'paginasRegistro no puede ser mayor que 100.' })
  paginasRegistro: number = 10;

  /** Texto libre para filtrar (placa, nombre, documento…, según el módulo). */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  buscar?: string;
}

/** Forma de todas las respuestas paginadas. */
export interface ResultadoPaginado<T> {
  datos: T[];
  total: number;
  paginaActual: number;
  paginasRegistro: number;
  totalPaginas: number;
}

export function paginar<T>(
  datos: T[],
  total: number,
  { paginaActual, paginasRegistro }: PaginacionDto,
): ResultadoPaginado<T> {
  return {
    datos,
    total,
    paginaActual,
    paginasRegistro,
    totalPaginas: Math.max(1, Math.ceil(total / paginasRegistro)),
  };
}

/** limit / offset de Sequelize a partir de la página pedida. */
export function limiteYDesplazamiento({ paginaActual, paginasRegistro }: PaginacionDto) {
  return { limit: paginasRegistro, offset: (paginaActual - 1) * paginasRegistro };
}
