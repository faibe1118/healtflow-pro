import { IsInt, IsString, Min, Max, Matches } from 'class-validator';
// Nota: Necesitarás instalar class-validator: npm install class-validator class-transformer

export class CreateScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number; // 0=Domingo, 1=Lunes...

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in HH:MM format (e.g. 08:30)',
  })
  startTime: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in HH:MM format (e.g. 17:00)',
  })
  endTime: string;
}
