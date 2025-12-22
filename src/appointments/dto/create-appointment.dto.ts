import { IsString, IsUUID, IsISO8601 } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsUUID()
  doctorId: string; // El ID del doctor (ese UUID largo)

  @IsISO8601()
  startTime: string; // Fecha y Hora exacta: "2025-12-22T09:00:00Z"

  @IsISO8601()
  endTime: string; // Fecha y Hora fin: "2025-12-22T09:30:00Z"
}
