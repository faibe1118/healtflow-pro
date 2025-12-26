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

  async findAll(user: any) {
    // CASO 1: Si es PACIENTE
    if (user.role === 'PATIENT') {
      // Buscamos su perfil de paciente usando su UserID
      const patient = await this.prisma.patient.findUnique({
        where: { userId: user.sub }, // 'sub' es el ID del usuario en el token
      });
      if (!patient) return []; // Si no tiene perfil, no tiene citas

      // Devolvemos solo SUS citas
      return this.prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: { doctor: true }, // Incluimos info del doctor para que vea con quién es
      });
    }

    // CASO 2: Si es DOCTOR
    if (user.role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({
        where: { userId: user.sub },
      });

      if (!doctor) return [];

      // Devolvemos solo las citas asignadas a ÉL
      return this.prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: { patient: true }, // Incluimos info del paciente para que sepa a quién atender
      });
    }

    // CASO 3: Si es ADMIN (Opcional)
    if (user.role === 'ADMIN') {
      return this.prisma.appointment.findMany({
        include: { patient: true, doctor: true },
      });
    }

    return []; // Por defecto
  }

  async updateStatus(id: string, status: 'CONFIRMED' | 'CANCELED') {
    return this.prisma.appointment.update({
      where: { id },
      data: { status},
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
