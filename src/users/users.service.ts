import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //verificar si el ususario ya exite (Reglas del negocio)
  async create(createUserDto: CreateUserDto) {
    console.log('------ Intento de registro -----');
    console.log('Datos recibidos: ', createUserDto);
    console.log('Es doctor: ', createUserDto.role === 'DOCTOR');
    console.log('longitu del rol: ', createUserDto.role.length);

    const existingUSer = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUSer) {
      throw new ConflictException('Email ya registrado');
    }

    //Encriptar la contraseña (seguridad)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    //Crear el usuario en la base de datos
    const newUSer = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash: passwordHash, //guardamos el hash no la password plana
        role: createUserDto.role,

        doctorProfile:
          createUserDto.role === 'DOCTOR'
            ? {
                create: {
                  firstName: createUserDto.firstName,
                  lastName: createUserDto.lastName,
                  medicalLicenseNumber: createUserDto.medicalLicence,
                },
              }
            : undefined,

        patientProfile:
          createUserDto.role === 'PATIENT'
            ? {
                create: {
                  firstName: createUserDto.firstName,
                  lastName: createUserDto.lastName,
                  //demas campos que tango que agregar luego para este campo
                },
              }
            : undefined,
      },
    });

    //Retonar el usuario (¡Pero borrando el hash para no mostrarlo!)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...result } = newUSer;
    return result;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
