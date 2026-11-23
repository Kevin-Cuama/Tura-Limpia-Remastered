/**
 * Pruebas de punta a punta del acceso administrativo (entrega 1).
 *
 * Levantan la aplicación completa contra la base de datos del .env, así que
 * antes de ejecutarlas se debe tener la base creada y el administrador cargado:
 *   npm run migrate && npm run seed && npm run test:e2e
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from './../src/app.module.js';
import { configurarApp } from './../src/configurar-app.js';

const correo = process.env.ADMIN_CORREO ?? '';
const contrasena = process.env.ADMIN_CONTRASENA ?? '';

describe('Acceso administrativo (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    if (!correo || !contrasena) {
      throw new Error('Defina ADMIN_CORREO y ADMIN_CONTRASENA en el .env');
    }
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configurarApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const iniciarSesion = async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/login')
      .send({ correo, contrasena })
      .expect(200);
    return respuesta.body.token as string;
  };

  it('RF-01: credenciales incorrectas devuelven un mensaje comprensible', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/login')
      .send({ correo, contrasena: 'contrasena-incorrecta' })
      .expect(401);

    expect(respuesta.body.message).toBe('Correo o contraseña incorrectos.');
  });

  it('RF-01: credenciales correctas devuelven un token y los datos del administrador', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/login')
      .send({ correo, contrasena })
      .expect(200);

    expect(respuesta.body.token).toEqual(expect.any(String));
    expect(respuesta.body.administrador.correo).toBe(correo);
    expect(respuesta.body.administrador).not.toHaveProperty('contrasena');
  });

  it('RF-03: sin token no se puede usar ninguna ruta administrativa', async () => {
    const perfil = await request(app.getHttpServer())
      .get('/api/v1/administrador/perfil')
      .expect(401);
    expect(perfil.body.message).toBe('Token no proporcionado.');

    await request(app.getHttpServer()).post('/api/v1/logout').expect(401);
  });

  it('RF-03: un token falso es rechazado', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/administrador/perfil')
      .set('Authorization', 'Bearer token_falso')
      .expect(401);
  });

  it('RF-03: con token válido se accede al perfil', async () => {
    const token = await iniciarSesion();

    const perfil = await request(app.getHttpServer())
      .get('/api/v1/administrador/perfil')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Object.keys(perfil.body).sort()).toEqual(['correo', 'id', 'nombre']);
  });

  it('RF-02: después de cerrar sesión el mismo token ya no sirve', async () => {
    const token = await iniciarSesion();

    await request(app.getHttpServer())
      .post('/api/v1/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const respuesta = await request(app.getHttpServer())
      .get('/api/v1/administrador/perfil')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
    expect(respuesta.body.message).toBe(
      'La sesión fue cerrada. Inicie sesión de nuevo.',
    );

    // Una sesión nueva sí funciona.
    const tokenNuevo = await iniciarSesion();
    await request(app.getHttpServer())
      .get('/api/v1/administrador/perfil')
      .set('Authorization', `Bearer ${tokenNuevo}`)
      .expect(200);
  });

  it('CORS: el frontend puede llamar a la API desde otra dirección', async () => {
    const respuesta = await request(app.getHttpServer())
      .options('/api/v1/login')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type,authorization')
      .expect(204);

    expect(respuesta.headers['access-control-allow-origin']).toBeDefined();
    expect(respuesta.headers['access-control-allow-headers']).toContain(
      'Authorization',
    );
  });
});
