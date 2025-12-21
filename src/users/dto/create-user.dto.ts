import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsEnum(['PATIENT', 'DOCTOR', 'ADMIN'], {
    message: 'El rol debe ser PATIENT, DOCTOR o ADMIN',
  })
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';

  // --- Campos Opcionales (Perfil) ---

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  medicalLicense?: string;
}
