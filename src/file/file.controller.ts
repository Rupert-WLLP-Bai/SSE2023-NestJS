import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { getAccessKey, getSecretKey, getQiniuBucket, getQiniuDomain } from '../common/key';
import * as qiniu from 'qiniu';
import axios from 'axios';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('file')
@ApiTags('file')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // 测试七牛云上传文件
  @Post('qiniu')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'qiniu_files',
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    description: 'Upload file',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFileToQiniu(@UploadedFile() file) {
    // 定义鉴权对象
    const mac = new qiniu.auth.digest.Mac(getAccessKey(), getSecretKey());
    // 定义配置对象
    const options = {
      scope: getQiniuBucket(),
    };
    // 生成上传凭证
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    // 定义上传对象
    const config = new qiniu.conf.Config({
      zone: qiniu.zone.Zone_z2,
    });
    // 上传对象
    const formUploader = new qiniu.form_up.FormUploader(config);
    // 上传凭证
    const putExtra = new qiniu.form_up.PutExtra();
    // 上传文件
    formUploader.putFile(
      uploadToken,
      file.originalname,
      file.path,
      putExtra,
      (respErr, respBody, respInfo) => {
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode == 200) {
          console.log(respBody);
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
        }
      },
    );
    // 日志输出文件内容
    console.log(file);
  }

  // 测试七牛云下载文件
  @Get('qiniu/:filepath')
  @ApiParam({
    name: 'filepath',
    description: 'The path of the file to download',
    example: 'test_file.txt',
  })
  async downloadFileFromQiniu(@Param('filepath') filepath: string, @Res() res) {
    const mac = new qiniu.auth.digest.Mac(getAccessKey(), getSecretKey());
    const config = new qiniu.conf.Config();
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    const publicBucketDomain = getQiniuDomain();
    const publicDownloadUrl = bucketManager.publicDownloadUrl(
      publicBucketDomain,
      filepath,
    );
    console.log(publicDownloadUrl);
    // 使用axios下载文件
    const response = await axios({
      method: 'GET',
      url: `http://${publicDownloadUrl}`,
      responseType: 'stream',
    });
    console.log(response.data);
    // 让浏览器弹出下载框
    res.setHeader('Content-disposition', 'attachment; filename=' + filepath);
    response.data.pipe(res);
  }

  // 测试七牛云查询文件
  // 返回文件名列表
  @Get('qiniu')
  async listFileFromQiniu() {
    // 定义鉴权对象
    const mac = new qiniu.auth.digest.Mac(getAccessKey(), getSecretKey());
    // 定义配置对象
    const config = new qiniu.conf.Config({
      zone: qiniu.zone.Zone_z2,
    });
    // 定义空间管理对象
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    // 定义空间名
    const bucket = getQiniuBucket();
    // 定义前缀
    const prefix = '';
    // 定义分隔符
    const delimiter = '';
    // 定义限制返回的文件数量
    const limit = 1000;
    // 定义列举操作的起始位置
    const options = {
      limit,
      prefix,
    };
    // 返回文件名列表json
    return new Promise((resolve, reject) => {
      bucketManager.listPrefix(bucket, options, (err, respBody, respInfo) => {
        if (err) {
          reject(err);
        } else {
          if (respInfo.statusCode == 200) {
            resolve(respBody);
          } else {
            reject(respBody);
          }
        }
      });
    });
  }
}
