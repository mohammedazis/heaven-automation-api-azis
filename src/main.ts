import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from './utils/mongo.exception';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.useStaticAssets(join(__dirname, "."));
  app.useGlobalFilters(new MongoExceptionFilter());
  // app.use(cookieParser);

  await app.listen(5656);
}
bootstrap();
