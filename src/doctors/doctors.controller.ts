import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/get-user.decorator';

@Controller('doctors')
@UseGuards(AuthGuard('jwt')) // ¡Todo protegido!
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post('schedule')
  createSchedule(
    @CurrentUser('userId') userId: string, // <-- ¡Mira qué elegancia!
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.doctorsService.setSchedule(userId, createScheduleDto);
  }
}
