import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { TokenRevocadoRepository } from '../repositories/token-revocado.repository.js';
import { AdministradorRepository } from '../../administrador/repositories/administrador.repository.js';
import {
  ERoles,
  PayloadJWT,
} from '../../../core/interfaces/payload-jwt.interface.js';
import { MensajesError } from '../../../core/constants/mensajes-error.js';

@Injectable()
export class AutenticacionService {
  constructor(private readonly jwtService: JwtService) {}

  async iniciarSesion(correo: string, contrasena: string) {
    const administrador = await AdministradorRepository.buscarPorCorreo(correo);
    if (!administrador) {
      throw new UnauthorizedException(MensajesError.CREDENCIALES_INVALIDAS);
    }

    const esValida = await bcrypt.compare(contrasena, administrador.contrasena);
    if (!esValida) {
      throw new UnauthorizedException(MensajesError.CREDENCIALES_INVALIDAS);
    }

    const payload: PayloadJWT = {
      idUsuario: administrador.id,
      rol: ERoles.ADMINISTRADOR,
    };

    return {
      mensaje: 'Bienvenido administrador',
      // jwtid: identificador único del token, para poder cerrarlo en el logout.
      token: await this.jwtService.signAsync(payload, { jwtid: randomUUID() }),
      administrador: {
        id: administrador.id,
        nombre: administrador.nombre,
        correo: administrador.correo,
      },
    };
  }

  // RF-02: el token queda inválido aunque alguien lo haya guardado.
  async cerrarSesion(usuario: PayloadJWT) {
    if (usuario.jti && usuario.exp) {
      await TokenRevocadoRepository.revocar(
        usuario.jti,
        new Date(usuario.exp * 1000),
      );
    }
    return {
      mensaje: 'Sesión cerrada correctamente.',
    };
  }
}
