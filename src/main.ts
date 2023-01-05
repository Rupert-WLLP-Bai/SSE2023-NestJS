import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 引入swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  // 开启跨域
  app.enableCors();
  // 设置全局前缀
  app.setGlobalPrefix('api');
  // 添加swagger
  const options = new DocumentBuilder()
    .setTitle('Nestjs API')
    .setDescription('Nestjs API')
    .setVersion('1.0')
    .addTag('Nestjs API')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  // 启动服务
  await app.listen(3000);
}
bootstrap();
