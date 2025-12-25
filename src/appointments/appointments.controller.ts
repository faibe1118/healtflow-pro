import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/get-user.decorator';

@Controller('appointments')
@UseGuards(AuthGuard('jwt')) // <--- ¡CANDADO PUESTO!
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(
    @CurrentUser('userId') patientId: string, // Obtenemos el ID del token
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(patientId, createAppointmentDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.appointmentsService.findAll(user);
  }
}
