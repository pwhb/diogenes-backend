import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import ENV from './config/env';
import { ValidationPipe } from '@nestjs/common';
import {
  GenericExceptionFilter,
  validationExceptionHandler,
} from './common/exceptions/handlers';
import { DevInterceptor } from './common/exceptions/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('diogenes')
    .setDescription('')
    .setVersion(ENV.VERSION)
    .addTag('default')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/swagger.json',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: validationExceptionHandler,
    }),
  );
  app.useGlobalFilters(new GenericExceptionFilter());
  if (configService.get('NODE_ENV') === 'DEV') {
    app.useGlobalInterceptors(new DevInterceptor());
  }
  await app.listen(configService.get('PORT'));
}
bootstrap();
