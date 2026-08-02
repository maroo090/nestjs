import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  console.log(`server is running on port ${port}`);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: 'http://localhost:3000',
    //credentials: true,
  });

    const swagger=new DocumentBuilder().setVersion('1.0').build();
    const documantation=SwaggerModule.createDocument(app,swagger);
  SwaggerModule.setup('swagger',app,documantation);
  
  await app.listen(port);
}
void bootstrap();
