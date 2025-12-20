import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async setSchedule(userId: string, createScheduleDto: CreateScheduleDto) {
    // 1. Encontrar el perfil de Doctor asociado a este Usuario
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId: userId },
    });

    if (!doctor) {
      throw new BadRequestException(
        'El usuario actual no tiene perfil de Doctor',
      );
    }

    // 2. Convertir strings "08:00" a objetos Date (Truco para Prisma)
    const start = this.createDateFromTime(createScheduleDto.startTime);
    const end = this.createDateFromTime(createScheduleDto.endTime);

    if (start >= end) {
      throw new BadRequestException(
        'La hora de fin debe ser posterior a la de inicio',
      );
    }

    // 3. Guardar en la BD
    return this.prisma.doctorSchedule.create({
      data: {
        doctorId: doctor.id,
        dayOfWeek: createScheduleDto.dayOfWeek,
        startTime: start,
        endTime: end,
        slotDuration: 30, // Default 30 min por ahora
      },
    });
  }

  // Helper function (Privada)
  private createDateFromTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0); // Usamos UTC para evitar líos de zona horaria
    return date;
  }
}
