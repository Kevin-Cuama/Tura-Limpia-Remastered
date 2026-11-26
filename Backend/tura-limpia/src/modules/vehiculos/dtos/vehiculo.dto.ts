import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PaginacionDto } from '../../../core/dtos/paginacion.dto.js';
import { ABooleano, Normalizar, Recortar } from '../../../core/utils/transformaciones.util.js';
import { ESTADOS_VEHICULO, type EstadoVehiculo } from '../models/vehiculo.model.js';

const MENSAJE_ESTADO = `El estado operativo debe ser uno de: ${ESTADOS_VEHICULO.join(', ')}.`;

export class CrearVehiculoDto {
  @Normalizar()
  @Matches(/^[A-Z]{3}\d{3}$/, {
    message: 'La placa debe tener 3 letras y 3 números, por ejemplo ABC123.',
  })
  @IsString({ message: 'La placa es obligatoria.' })
  placa: string;

  @Recortar()
  @MaxLength(50, { message: 'La marca admite máximo 50 caracteres.' })
  @IsNotEmpty({ message: 'La marca es obligatoria.' })
  @IsString({ message: 'La marca es obligatoria.' })
  marca: string;

  @Recortar()
  @MaxLength(50, { message: 'El modelo admite máximo 50 caracteres.' })
  @IsNotEmpty({ message: 'El modelo es obligatorio.' })
  @IsString({ message: 'El modelo es obligatorio.' })
  modelo: string;

  @Type(() => Number)
  @Max(100, { message: 'La capacidad no puede ser mayor que 100.' })
  @Min(1, { message: 'La capacidad debe ser mayor que 0.' })
  @IsInt({ message: 'La capacidad debe ser un número entero.' })
  capacidad: number;

  @IsOptional()
  @IsIn(ESTADOS_VEHICULO, { message: MENSAJE_ESTADO })
  estadoOperativo?: EstadoVehiculo;
}

export class ActualizarVehiculoDto extends PartialType(CrearVehiculoDto) {}

export class CambiarEstadoVehiculoDto {
  @IsIn(ESTADOS_VEHICULO, { message: MENSAJE_ESTADO })
  estadoOperativo: EstadoVehiculo;
}

export class ListarVehiculosDto extends PaginacionDto {
  @IsOptional()
  @IsIn(ESTADOS_VEHICULO, { message: MENSAJE_ESTADO })
  estadoOperativo?: EstadoVehiculo;

  @IsOptional()
  @ABooleano()
  @IsBoolean({ message: 'activo debe ser true o false.' })
  activo?: boolean;
}

/** Lo que responde la API por cada vehículo. */
export interface VehiculoRespuesta {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  capacidad: number;
  estadoOperativo: EstadoVehiculo;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}
