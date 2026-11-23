'use strict';

/**
 * Datos mínimos de prueba (RF-04 y lista de chequeo de la entrega 1).
 *
 * Se puede ejecutar varias veces: lo que ya existe no se vuelve a crear
 * (ON CONFLICT DO NOTHING sobre las columnas únicas). Las programaciones
 * solo se crean si la tabla programacion está vacía.
 *
 * Uso: npm run seed   (después de npm run migrate)
 */

const PLACAS = ['TLA101', 'TLA102', 'TLA103', 'TLA104', 'TLA105'];
const DOCUMENTOS = [
  '1111000001',
  '1111000002',
  '1111000003',
  '1111000004',
  '1111000005',
];
const BARRIOS = [
  'La Playita',
  'Bellavista',
  'Cascajal',
  'El Firme',
  'Pueblo Nuevo',
  'San Luis',
  'Juan XXIII',
  'Lleras',
];
const RUTAS = ['Ruta Centro', 'Ruta Isla Cascajal', 'Ruta Continente'];
const TURNOS = ['Mañana', 'Tarde', 'Madrugada'];

/** Lista de textos SQL escapados: 'a', 'b', 'c' */
const lista = (q, valores) => valores.map((v) => q.escape(v)).join(', ');

module.exports = {
  async up(queryInterface) {
    const q = queryInterface.sequelize;

    await q.transaction(async (transaction) => {
      const sql = (texto) => q.query(texto, { transaction });

      // Vehículos: uno en cada estado operativo y uno desactivado.
      await sql(`
        INSERT INTO vehiculo (placa, marca, modelo, capacidad, estado_operativo, activo, "createdAt", "updatedAt") VALUES
          ('TLA101', 'Chevrolet', 'NPR Compactador', 8,  'DISPONIBLE',        true,  now(), now()),
          ('TLA102', 'Hino',      'Serie 300',       10, 'DISPONIBLE',        true,  now(), now()),
          ('TLA103', 'Isuzu',     'FVR',             12, 'EN_SERVICIO',       true,  now(), now()),
          ('TLA104', 'Ford',      'Cargo 1723',      9,  'MANTENIMIENTO',     true,  now(), now()),
          ('TLA105', 'Kia',       'K3000',           4,  'FUERA_DE_SERVICIO', false, now(), now())
        ON CONFLICT DO NOTHING`);

      // Conductores: activos, uno inactivo y uno con la licencia vencida.
      await sql(`
        INSERT INTO conductor (nombres, apellidos, numero_documento, numero_licencia, categoria_licencia, vencimiento_licencia, estado, "createdAt", "updatedAt") VALUES
          ('Carlos Andrés', 'Rentería Mosquera', '1111000001', '1111000001', 'C2', '2029-06-30', 'ACTIVO',   now(), now()),
          ('María José',    'Valencia Riascos',  '1111000002', '1111000002', 'C2', '2028-03-15', 'ACTIVO',   now(), now()),
          ('Jhon Fredy',    'Angulo Caicedo',    '1111000003', '1111000003', 'C3', '2030-01-20', 'ACTIVO',   now(), now()),
          ('Luis Alberto',  'Mina Hurtado',      '1111000004', '1111000004', 'C2', '2027-11-10', 'INACTIVO', now(), now()),
          ('Rosa Elena',    'Castillo Murillo',  '1111000005', '1111000005', 'C1', '2025-08-01', 'ACTIVO',   now(), now())
        ON CONFLICT DO NOTHING`);

      // Barrios de Buenaventura.
      await sql(`
        INSERT INTO barrio (nombre, descripcion) VALUES
          ('La Playita',   'Sector de la isla Cascajal'),
          ('Bellavista',   'Sector continental'),
          ('Cascajal',     'Centro de la isla'),
          ('El Firme',     'Sector continental'),
          ('Pueblo Nuevo', 'Sector de la isla Cascajal'),
          ('San Luis',     NULL),
          ('Juan XXIII',   NULL),
          ('Lleras',       NULL)
        ON CONFLICT DO NOTHING`);

      // Turnos (la hora de fin siempre es posterior a la de inicio).
      await sql(`
        INSERT INTO turno (nombre, hora_inicio, hora_fin) VALUES
          ('Mañana',    '06:00', '14:00'),
          ('Tarde',     '14:00', '22:00'),
          ('Madrugada', '00:00', '06:00')
        ON CONFLICT DO NOTHING`);

      // Rutas: dos activas con recorrido y una suspendida sin recorrido.
      await sql(`
        INSERT INTO ruta (nombre, descripcion, tipo_servicio, estado, "createdAt", "updatedAt") VALUES
          ('Ruta Centro',        'Recorrido por el centro de la isla Cascajal', 'Recolección domiciliaria', 'ACTIVA',     now(), now()),
          ('Ruta Isla Cascajal', 'Barrios del sur de la isla',                  'Recolección domiciliaria', 'ACTIVA',     now(), now()),
          ('Ruta Continente',    'Sector continental (pendiente de trazar)',    'Barrido',                  'SUSPENDIDA', now(), now())
        ON CONFLICT DO NOTHING`);

      // Barrios que cubre cada ruta.
      await sql(`
        INSERT INTO ruta_barrio (id_ruta, id_barrio)
        SELECT r.id_ruta, b.id_barrio
          FROM (VALUES
            ('Ruta Centro', 'Cascajal'), ('Ruta Centro', 'La Playita'),
            ('Ruta Isla Cascajal', 'Pueblo Nuevo'), ('Ruta Isla Cascajal', 'San Luis'),
            ('Ruta Continente', 'Bellavista'), ('Ruta Continente', 'El Firme')
          ) AS v(ruta, barrio)
          JOIN ruta r ON r.nombre = v.ruta
          JOIN barrio b ON b.nombre = v.barrio
        ON CONFLICT DO NOTHING`);

      // Recorridos (solo si la ruta todavía no tiene puntos).
      await sql(`
        INSERT INTO punto_ruta (id_ruta, orden, latitud, longitud, referencia)
        SELECT r.id_ruta, v.orden, v.latitud, v.longitud, v.referencia
          FROM (VALUES
            ('Ruta Centro', 1, 3.8833, -77.0667, 'Inicio: parque principal'),
            ('Ruta Centro', 2, 3.8845, -77.0641, NULL),
            ('Ruta Centro', 3, 3.8858, -77.0618, NULL),
            ('Ruta Centro', 4, 3.8871, -77.0590, 'Fin: muelle turístico'),
            ('Ruta Isla Cascajal', 1, 3.8790, -77.0700, 'Inicio'),
            ('Ruta Isla Cascajal', 2, 3.8775, -77.0672, NULL),
            ('Ruta Isla Cascajal', 3, 3.8762, -77.0645, 'Fin')
          ) AS v(ruta, orden, latitud, longitud, referencia)
          JOIN ruta r ON r.nombre = v.ruta
         WHERE NOT EXISTS (SELECT 1 FROM punto_ruta p WHERE p.id_ruta = r.id_ruta)`);

      // Programaciones de ejemplo (solo sobre una base sin programaciones).
      // Empiezan hoy (fecha de Colombia) y cumplen todas las validaciones (sin cruces).
      const [[{ total }]] = await sql(
        'SELECT COUNT(*)::int AS total FROM programacion',
      );
      if (total === 0) {
        await sql(`
          WITH nuevas AS (
            INSERT INTO programacion (id_ruta, id_vehiculo, id_conductor, id_turno, fecha, estado, "createdAt", "updatedAt")
            SELECT r.id_ruta, v.id_vehiculo, c.id_conductor, t.id_turno, (now() AT TIME ZONE 'America/Bogota')::date, 'ACTIVA', now(), now()
              FROM (VALUES
                ('Ruta Centro',        'TLA101', '1111000001', 'Mañana'),
                ('Ruta Isla Cascajal', 'TLA102', '1111000002', 'Tarde')
              ) AS d(ruta, placa, documento, turno)
              JOIN ruta r ON r.nombre = d.ruta
              JOIN vehiculo v ON v.placa = d.placa
              JOIN conductor c ON c.numero_documento = d.documento
              JOIN turno t ON t.nombre = d.turno
            RETURNING id_programacion, id_turno
          )
          INSERT INTO programacion_dia (id_programacion, dia_semana)
          SELECT n.id_programacion, dia
            FROM nuevas n
            JOIN turno t ON t.id_turno = n.id_turno
            CROSS JOIN LATERAL unnest(
              CASE WHEN t.nombre = 'Mañana'
                   THEN ARRAY['LUNES', 'MIERCOLES', 'VIERNES']
                   ELSE ARRAY['MARTES', 'JUEVES', 'SABADO']
              END
            ) AS dia`);
      }
    });
  },

  async down(queryInterface) {
    const q = queryInterface.sequelize;
    await q.transaction(async (transaction) => {
      const sql = (texto) => q.query(texto, { transaction });
      // Primero lo que depende de los demás (los días se borran en cascada).
      await sql(`
        DELETE FROM programacion
         WHERE id_vehiculo IN (SELECT id_vehiculo FROM vehiculo WHERE placa IN (${lista(q, PLACAS)}))
            OR id_conductor IN (SELECT id_conductor FROM conductor WHERE numero_documento IN (${lista(q, DOCUMENTOS)}))`);
      // Los puntos y los barrios de cada ruta se borran en cascada.
      await sql(`DELETE FROM ruta WHERE nombre IN (${lista(q, RUTAS)})`);
      await sql(`
        DELETE FROM turno t WHERE t.nombre IN (${lista(q, TURNOS)})
           AND NOT EXISTS (SELECT 1 FROM programacion p WHERE p.id_turno = t.id_turno)`);
      await sql(`
        DELETE FROM barrio b WHERE b.nombre IN (${lista(q, BARRIOS)})
           AND NOT EXISTS (SELECT 1 FROM ruta_barrio rb WHERE rb.id_barrio = b.id_barrio)`);
      await sql(
        `DELETE FROM conductor WHERE numero_documento IN (${lista(q, DOCUMENTOS)})`,
      );
      await sql(`DELETE FROM vehiculo WHERE placa IN (${lista(q, PLACAS)})`);
    });
  },
};
