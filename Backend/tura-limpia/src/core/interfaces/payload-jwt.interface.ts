import type { Request } from 'express';

export enum ERoles {
  ADMINISTRADOR = 'ADMINISTRADOR',
}

export interface PayloadJWT {
  idUsuario: number;
  rol: ERoles;
}

export interface RequestAutenticado extends Request {
  usuario: PayloadJWT;
}
