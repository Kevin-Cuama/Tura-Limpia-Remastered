import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { MensajesError } from '../constants/mensajes-error.js';

/**
 * Red de seguridad: si dos peticiones chocan contra una restricción única o
 * una llave foránea de PostgreSQL, se responde 409 con un mensaje claro en
 * lugar de un 500. Los servicios ya validan antes; esto cubre los casos raros.
 */
@Catch(UniqueConstraintError, ForeignKeyConstraintError)
export class ErroresBdFilter implements ExceptionFilter {
  catch(error: UniqueConstraintError | ForeignKeyConstraintError, host: ArgumentsHost) {
    const mensaje =
      error instanceof UniqueConstraintError
        ? MensajesError.REGISTRO_REPETIDO
        : MensajesError.REGISTRO_EN_USO;
    const respuesta = new ConflictException(mensaje).getResponse();
    host.switchToHttp().getResponse<Response>().status(409).json(respuesta);
  }
}
