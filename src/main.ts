import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
// 引入swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// 引入 ValidationPipe
import { ValidationPipe } from '@nestjs/common';
// 引入全局异常过滤器
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
// 引入成功响应拦截器
import { TransformInterceptor } from './common/interceptors/success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离非白名单属性
      forbidNonWhitelisted: true, // 如果有非白名单属性，抛出错误
      transform: true, // 自动转换参数类型
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式类型转换
      },
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string>('CORS_ORIGINS') || '';

  // 开启跨域
  app.enableCors({
    origin: corsOrigins.split(',').map((origin) => origin.trim()),
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // 设置全局前缀
  app.setGlobalPrefix('api');
  // 添加swagger
  const options = new DocumentBuilder()
    .setTitle('SSE2023 API')
    .setDescription('软件工程课程设计 高程教学管理系统')
    .setVersion('0.0.1')
    // 添加 Bearer JWT 鉴权
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: '输入 JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  // 启动服务
  await app.listen(3000);
}
bootstrap();
