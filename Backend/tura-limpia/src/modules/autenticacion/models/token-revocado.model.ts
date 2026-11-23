import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

/**
 * Tokens de sesiones cerradas (RF-02). Mientras no venzan, el guard los
 * rechaza. Es una tabla técnica, no forma parte del modelo entidad-relación.
 */
@Table({ tableName: 'token_revocado', timestamps: false })
export class TokenRevocado extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING(36) })
  jti: string;

  @Column({ field: 'expira_en', type: DataType.DATE, allowNull: false })
  expiraEn: Date;
}
