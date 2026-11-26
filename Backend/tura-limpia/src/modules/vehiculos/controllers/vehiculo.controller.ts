import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdministradorGuard } from '../../../core/guards/administrador.guard.js';
import { IdPipe } from '../../../core/pipes/id.pipe.js';
import {
  ActualizarVehiculoDto,
  CambiarEstadoVehiculoDto,
  CrearVehiculoDto,
  ListarVehiculosDto,
} from '../dtos/vehiculo.dto.js';
import { VehiculoService } from '../services/vehiculo.service.js';

/** RF-05 y RF-06. Todas las rutas exigen token de administrador (RF-03). */
@Controller('api/v1/vehiculos')
@UseGuards(AdministradorGuard)
export class VehiculoController {
  constructor(private readonly servicio: VehiculoService) {}

  @Get()
  listar(@Query() filtros: ListarVehiculosDto) {
    return this.servicio.listar(filtros);
  }

  @Post()
  crear(@Body() datos: CrearVehiculoDto) {
    return this.servicio.crear(datos);
  }

  @Get(':id')
  obtener(@Param('id', IdPipe) id: number) {
    return this.servicio.obtener(id);
  }

  @Patch(':id')
  actualizar(@Param('id', IdPipe) id: number, @Body() datos: ActualizarVehiculoDto) {
    return this.servicio.actualizar(id, datos);
  }

  @Patch(':id/estado')
  cambiarEstado(@Param('id', IdPipe) id: number, @Body() datos: CambiarEstadoVehiculoDto) {
    return this.servicio.cambiarEstado(id, datos.estadoOperativo);
  }

  @Patch(':id/desactivar')
  desactivar(@Param('id', IdPipe) id: number) {
    return this.servicio.desactivar(id);
  }

  @Patch(':id/activar')
  activar(@Param('id', IdPipe) id: number) {
    return this.servicio.activar(id);
  }
}
