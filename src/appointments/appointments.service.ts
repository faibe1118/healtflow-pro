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
    // 1. Obtener el ID del perfil del Paciente usando su UserID - validar que el paciente exista
    const patient = await this.prisma.patient.findUnique({
      where: { userId: patientUserId },
    });

    if (!patient) {
      throw new BadRequestException('El usuario no tiene perfil de Paciente');
    }

    // 2. Validar que el Doctor exista
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: createAppointmentDto.doctorId },
    });

    if (!doctor) {
      throw new BadRequestException('El Doctor especificado no existe');
    }

    //3. Derector de colisiones
    //buscamos si hay alguna cita que se cruce con el horario solicitado
    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        doctorId: createAppointmentDto.doctorId,
        status: { not: 'CANCELED' }, // Ignorar citas canceladas
        AND: [
          {
            startTime: { lt: createAppointmentDto.endTime },
          },
          { 
            endTime: { gt: createAppointmentDto.startTime },
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new BadRequestException('Ya existe una cita en ese horario');
    }

    // 3. Crear la Cita
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
