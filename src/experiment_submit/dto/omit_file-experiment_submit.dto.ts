import { ApiProperty } from '@nestjs/swagger';

export class OmitFileExperimentSubmitDto {
  @ApiProperty({ description: '实验提交ID', example: 1, required: true })
  id: number;
  @ApiProperty({ description: '实验ID', example: 1, required: true })
  experimentId: number;
  @ApiProperty({ description: '学生ID', example: 2052526, required: true })
  studentId: number;
  @ApiProperty({
    description: '时间戳',
    example: new Date(),
    required: true,
  })
  timeStamp: bigint;
  @ApiProperty({
    description: '文件URL',
    example: 'http://xxx',
    required: true,
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
