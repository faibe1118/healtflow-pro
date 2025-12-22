import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    patientUserId: string,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    // 1. Obtener el ID del perfil del Paciente usando su UserID
    const patient = await this.prisma.patient.findUnique({
      where: { userId: patientUserId },
    });

    if (!patient) {
      throw new BadRequestException('El usuario no tiene perfil de Paciente');
    }

    // 2. Crear la Cita
    return this.prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: createAppointmentDto.doctorId,
        startTime: createAppointmentDto.startTime,
        endTime: createAppointmentDto.endTime,
        status: 'PENDING', // Por defecto está pendiente
      },
    });
  }

  findAll() {
    return this.prisma.appointment.findMany({
      include: { patient: true, doctor: true }, // ¡Trae los nombres, no solo IDs!
    });
  }

  // ... (deja los otros métodos vacíos por ahora)

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  // update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
  //   return `This action updates a #${id} appointment`;
  // }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
