import { BadRequestException, ParseIntPipe } from '@nestjs/common';

/** Valida que el :id de la URL sea un número entero: GET /vehiculos/abc → 400. */
export const IdPipe = new ParseIntPipe({
  exceptionFactory: () => new BadRequestException('El identificador debe ser un número entero.'),
});
