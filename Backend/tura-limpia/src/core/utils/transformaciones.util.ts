import { Transform } from 'class-transformer';

/** Quita espacios al inicio y al final de un texto. */
export const Recortar = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

/** Mayúsculas y sin espacios ni guiones: ' abc-123 ' → 'ABC123' (placas, licencias). */
export const Normalizar = () =>
  Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/[\s-]/g, '').toUpperCase() : value,
  );

/** Query strings 'true'/'false' → boolean. */
export const ABooleano = () =>
  Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value));
