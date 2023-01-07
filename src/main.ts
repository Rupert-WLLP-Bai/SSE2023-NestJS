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
    .setTitle('SSE2023 API')
    .setDescription('软件工程课程设计 高程教学管理系统')
    .setVersion('0.0.1')
    // .addTag('SSE2023')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  // 启动服务
  await app.listen(3000);
}
bootstrap();
