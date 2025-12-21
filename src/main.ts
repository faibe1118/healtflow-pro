import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <--- 1. IMPORTANTE: Importar esto

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- 2. CONFIGURACIÓN DE VALIDACIÓN GLOBAL (AQUÍ) ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // "Limpieza": Si envían datos extra que no están en el DTO, los elimina.
      forbidNonWhitelisted: true, // "Estricto": Si envían datos extra, lanza error 400.
      transform: true, // Convierte los tipos de datos automáticamente (ej: string a number si el DTO lo pide)
    }),
  );
  // ----------------------------------------------------

  // Habilitar CORS (útil para cuando conectemos el Frontend)
  app.enableCors();

  await app.listen(3000);
}
void bootstrap();
