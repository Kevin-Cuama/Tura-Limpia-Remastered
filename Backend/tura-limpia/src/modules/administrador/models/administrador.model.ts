import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'administrador', timestamps: true })
export class Administrador extends Model {
  @Column({ type: DataType.STRING })
  nombre: string;

  @Column({ type: DataType.STRING })
  correo: string;

  @Column({ type: DataType.STRING })
  contrasena: string;
}
