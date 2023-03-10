import { ApiProperty } from '@nestjs/swagger';

export class CreateExperimentSubmitDto {
  @ApiProperty({ description: '实验ID', example: 1, required: true })
  experimentId: number;
  @ApiProperty({ description: '学生ID', example: 2052526, required: true })
  studentId: number;
  @ApiProperty({
    description: '时间戳',
    example: Date.now(),
    required: true,
  })
  timeStamp: bigint;
  @ApiProperty({
    description: '文件',
    example: 'file',
    required: false,
    format: 'binary',
    type: 'string',
  })
  file: Express.Multer.File;
  @ApiProperty({
    description: '文件URL',
    example: 'http://xxx',
    required: false,
  })
  fileUrl: string;
  @ApiProperty({ description: '文件名', required: false, readOnly: true })
  fileName: string;
  @ApiProperty({ description: '文件大小', required: false, readOnly: true })
  fileSize: number;
  @ApiProperty({ description: '文件类型', required: false, readOnly: true })
  mineType: string;
  @ApiProperty({ description: '文件字段名', required: false, readOnly: true })
  fieldname: string;
  @ApiProperty({ description: '文件编码', required: false, readOnly: true })
  encoding: string;
}
