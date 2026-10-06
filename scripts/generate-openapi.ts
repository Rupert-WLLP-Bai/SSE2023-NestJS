/**
 * 生成 OpenAPI JSON 文档脚本
 * 使用方法: bun run scripts/generate-openapi.ts
 */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generateOpenAPIDocument() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  const options = new DocumentBuilder()
    .setTitle('SSE2023 API')
    .setDescription('软件工程课程设计 高程教学管理系统')
    .setVersion('0.0.1')
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

  // 确保输出目录存在
  const outputDir = path.join(__dirname, '../docs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 写入文件
  const outputPath = path.join(outputDir, 'openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  console.log(`OpenAPI JSON 已生成到: ${outputPath}`);
  console.log(`API 路径数量: ${Object.keys(document.paths).length}`);
  console.log(`Schemas 数量: ${Object.keys(document.components?.schemas || {}).length}`);

  await app.close();
}

generateOpenAPIDocument().catch(console.error);
