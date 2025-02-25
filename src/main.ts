import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './system/filters/bad-request-exception-filter';
import helmet from 'helmet';
import { KtqValidationPipes } from './system/pipes/ktq-validation-pipe';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prefix_version = '/api/v1';

  app.enableCors({
    origin: process.env.CORS.split(', '),
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.use(cookieParser());

  app.setGlobalPrefix(prefix_version, {
    exclude: [
      {
        path: 'client-medias/(.*)',
        method: RequestMethod.ALL,
      },
    ],
  });

  app.useGlobalFilters(new BadRequestExceptionFilter());

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.useGlobalPipes(
    new KtqValidationPipes({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: KtqValidationPipes.exceptionFactory,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(process.env.PORT);
}
bootstrap();
