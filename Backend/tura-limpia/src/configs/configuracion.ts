import * as dotenv from 'dotenv';

dotenv.config();

export class Config {
  static readonly puerto = Number(process.env.PORT);
  static readonly puertoLocal = process.env.PUERTO_LOCAL;
  static readonly dbHost = process.env.DB_HOST;
  static readonly dbPuerto = Number(process.env.DB_PORT);
  static readonly dbUsuario = process.env.DB_USER;
  static readonly dbContrasenna = process.env.DB_PASS;
  static readonly dbBaseDatos = process.env.DB_NAME;
  static readonly jwtSecret = process.env.JWT_SECRET;
  static readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '8h';
  static readonly bcryptSaltos = Number(process.env.BCRYPT_SALTOS ?? 10);
}
