import type { Request } from 'express';

export enum ERoles {
  ADMINISTRADOR = 'ADMINISTRADOR',
}

export interface PayloadJWT {
  idUsuario: number;
  rol: ERoles;
  /** Identificador único del token (lo agrega la librería JWT al firmar). */
  jti?: string;
  /** Fecha de vencimiento en segundos (la agrega la librería JWT al firmar). */
  exp?: number;
}

export interface RequestAutenticado extends Request {
  usuario: PayloadJWT;
}
