import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** Estados operativos de un vehículo (RF-06). Coinciden con el CHECK de la migración. */
export const ESTADOS_VEHICULO = [
  'DISPONIBLE',
  'EN_SERVICIO',
  'MANTENIMIENTO',
  'FUERA_DE_SERVICIO',
] as const;
export type EstadoVehiculo = (typeof ESTADOS_VEHICULO)[number];

@Table({ tableName: 'vehiculo', timestamps: true })
export class Vehiculo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ field: 'id_vehiculo', type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.STRING(10), allowNull: false })
  placa: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  marca: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  modelo: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  capacidad: number;

  @Column({ field: 'estado_operativo', type: DataType.STRING(20), allowNull: false })
  estadoOperativo: EstadoVehiculo;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  activo: boolean;
}
