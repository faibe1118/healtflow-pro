export class CreateUserDto {
  email: string;
  password: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN'; // Debe coincidir con tu Enum de Prisma

  firstName?: string;
  lastName?: string;
  medicalLicence?: string;
}
