import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT ?? 4000;

  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true })
  );

  await app.listen(port);
  Logger.log(`Server listening on *${port}`);
}

bootstrap().catch((error: Error) => {
  Logger.log(error.message);
});
