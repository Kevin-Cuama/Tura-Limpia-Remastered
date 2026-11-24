import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ERoles,
  PayloadJWT,
  RequestAutenticado,
} from '../interfaces/payload-jwt.interface.js';
import { MensajesError } from '../constants/mensajes-error.js';
import { TokenRevocadoRepository } from '../../modules/autenticacion/repositories/token-revocado.repository.js';

@Injectable()
export class AdministradorGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestAutenticado>();
    const token = this.extraerToken(request);

    if (!token) {
      throw new UnauthorizedException(MensajesError.TOKEN_NO_PROPORCIONADO);
    }

    let payload: PayloadJWT;
    try {
      payload = await this.jwtService.verifyAsync<PayloadJWT>(token);
    } catch {
      throw new UnauthorizedException(MensajesError.TOKEN_INVALIDO_O_EXPIRADO);
    }

    if (!payload?.idUsuario || payload.rol !== ERoles.ADMINISTRADOR) {
      throw new UnauthorizedException(MensajesError.SIN_PERMISOS_ADMINISTRADOR);
    }

    // RF-02: un token sin identificador no se puede cerrar, así que no se acepta.
    if (!payload.jti) {
      throw new UnauthorizedException(MensajesError.TOKEN_INVALIDO_O_EXPIRADO);
    }
    if (await TokenRevocadoRepository.estaRevocado(payload.jti)) {
      throw new UnauthorizedException(MensajesError.SESION_CERRADA);
    }

    request.usuario = payload;
    return true;
  }

  private extraerToken(request: RequestAutenticado): string | null {
    const [tipo, token] = request.headers.authorization?.split(' ') ?? [];
    return tipo === 'Bearer' && token ? token : null;
  }
}
