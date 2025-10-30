import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // 글로벌 접두사 설정 (API 버전 관리)
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // 유효성 검사 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS 설정
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
  });

  // 정적 파일 서빙 (Swagger 커스텀 스크립트)
  app.useStaticAssets(join(__dirname, '..', 'swagger'), {
    prefix: '/swagger/',
  });

  // Swagger 설정
  const swaggerTitle = configService.get<string>(
    'SWAGGER_TITLE',
    'SNU Healthing You API',
  );
  const swaggerDescription = configService.get<string>(
    'SWAGGER_DESCRIPTION',
    'SNU Healthing You API 문서',
  );
  const swaggerPath = configService.get<string>('SWAGGER_PATH', 'api/docs');

  const config = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion(configService.get<string>('API_VERSION', '1.0'))
    .addTag('health')
    .addTag('users')
    .addTag('auth')
    .addTag('institution-config')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customJs: '/swagger/swagger-ui-custom.js',
    customSiteTitle: swaggerTitle,
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 Swagger documentation: http://localhost:${port}/${swaggerPath}`,
  );
}
bootstrap();
