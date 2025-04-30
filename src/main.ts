import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Express qo‘shamiz
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './Guard/verify_token.guard';
import { JwtService } from '@nestjs/jwt';
import * as cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // Tipini aniqlab beramiz
  const PORT = process.env.PORT || 3000;
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);

  app.use(cookieParser());
  app.setViewEngine('ejs'); // EJS renderer
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useGlobalGuards(new JwtAuthGuard(reflector, jwtService));
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
