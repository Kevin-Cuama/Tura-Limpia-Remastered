import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Config } from './configs/configuracion.js';
import { ErroresBdFilter } from './core/filters/errores-bd.filter.js';

/**
 * Configuración común de la aplicación. La usan main.ts y las pruebas e2e,
 * para que las pruebas se comporten igual que el servidor real.
 */
export function configurarApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  // Restricciones únicas o llaves foráneas que falla PostgreSQL → 409 con mensaje claro.
  app.useGlobalFilters(new ErroresBdFilter());

  // CORS: permite que el frontend, servido desde otra dirección, llame a la API.
  // En producción se debe definir CORS_ORIGENES con la URL pública del frontend.
  app.enableCors({
    origin: Config.corsOrigenes.length > 0 ? Config.corsOrigenes : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}
