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

@Injectable()
export class AdministradorGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestAutenticado>();
    const token = this.extraerToken(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado.');
    }

    let payload: PayloadJWT;
    try {
      payload = await this.jwtService.verifyAsync<PayloadJWT>(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado.');
    }

    if (!payload?.idUsuario || payload.rol !== ERoles.ADMINISTRADOR) {
      throw new UnauthorizedException('No tienes permisos de administrador.');
    }

    request.usuario = payload;
    return true;
  }

  private extraerToken(request: RequestAutenticado): string | null {
    const [tipo, token] = request.headers.authorization?.split(' ') ?? [];
    return tipo === 'Bearer' && token ? token : null;
  }
}
