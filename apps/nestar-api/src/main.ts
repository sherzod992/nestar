// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT_API || 3000);
  console.log(`🚀 API running on port ${process.env.PORT_API}`);
}
bootstrap();
