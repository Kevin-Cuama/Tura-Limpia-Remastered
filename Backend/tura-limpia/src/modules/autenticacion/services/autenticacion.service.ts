import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
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
      token: await this.jwtService.signAsync(payload),
      administrador: {
        id: administrador.id,
        nombre: administrador.nombre,
        correo: administrador.correo,
      },
    };
  }
}
