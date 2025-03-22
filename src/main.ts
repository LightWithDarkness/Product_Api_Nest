import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //
  const config = new DocumentBuilder()
    .setTitle('Product API')
    .setDescription('API for managing products with authentication')
    .setVersion('1.0')
    .addTag('API Routes')
    .addBearerAuth(
      {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
      },
      'accessToken', 
  )
    .build();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/swagger`);
}

bootstrap();
