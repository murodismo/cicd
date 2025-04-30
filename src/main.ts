import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Express qo‘shamiz
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // Tipini aniqlab beramiz

  const PORT = process.env.PORT || 3000;

  app.setViewEngine('ejs'); // EJS renderer
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Foydalanuvchi autentifikatsiyasi uchun API')
    .setVersion('1.0')
    .addTag('auth') 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // swagger

  await app.listen(PORT, () => {
    console.log('Server is running at port: ' + PORT);
  });
}
bootstrap();
