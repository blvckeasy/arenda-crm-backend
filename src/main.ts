import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  AllUnexpectedExceptionsFilter,
  BaseErrorFilter,
  ResponseInterceptor,
  ValidationExceptionFilter
} from './common';

async function bootstrap() {
  const port = process.env.PORT ?? 4000;

  const app = await NestFactory.create(AppModule);
  
  app.enableCors()

  app.useGlobalInterceptors(new ResponseInterceptor())

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(
    new AllUnexpectedExceptionsFilter(),
    new ValidationExceptionFilter(),
    new BaseErrorFilter(),
  );

  await app.listen(port);
  Logger.log(`Server listening on *${port}`);
}

bootstrap().catch((error: Error) => {
  Logger.log(error.message);
});
