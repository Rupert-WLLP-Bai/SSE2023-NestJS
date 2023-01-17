import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ExperimentSubmitService } from './experiment_submit.service';
import { CreateExperimentSubmitDto } from './dto/create-experiment_submit.dto';
import { UpdateExperimentSubmitDto } from './dto/update-experiment_submit.dto';
import {
  DeleteResponse,
  QueryResponse,
  NormalResponse,
  UpdateResponse,
} from '../common/response/response.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { OmitFileExperimentSubmitDto } from './dto/omit_file-experiment_submit.dto';
import multer from 'multer';

@Controller('experiment-submit')
@ApiTags('experiment-submit')
export class ExperimentSubmitController {
  constructor(
    private readonly experimentSubmitService: ExperimentSubmitService,
  ) {}

  @Post()
  @ApiOperation({ summary: '创建实验提交' })
  @ApiProperty({ description: '文件', example: 'file', required: false })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createExperimentSubmitDto: CreateExperimentSubmitDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<NormalResponse> {
    const response: NormalResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    if (!file) {
      response.success = false;
      response.errorMessage = '上传文件不能为空';
      return response;
    }
    try {
      createExperimentSubmitDto.file = file;
      createExperimentSubmitDto.fileName = file.originalname;
      createExperimentSubmitDto.fileSize = file.size;
      createExperimentSubmitDto.mineType = file.mimetype;
      createExperimentSubmitDto.fieldname = file.fieldname;
      createExperimentSubmitDto.encoding = file.encoding;
      response.data = await this.experimentSubmitService.create(
        createExperimentSubmitDto,
      );
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: '查询所有实验提交，不包含文件' })
  async findAll(): Promise<QueryResponse> {
    const response: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      const list = await this.experimentSubmitService.findAll();
      // 去除list中的file字段
      const omitFileList = list.map((item) => {
        const omitFileItem = new OmitFileExperimentSubmitDto();
        omitFileItem.id = item.id;
        omitFileItem.experimentId = item.experimentId;
        omitFileItem.studentId = item.studentId;
        omitFileItem.timeStamp = item.timeStamp;
        omitFileItem.fileUrl = item.fileUrl;
        omitFileItem.fileName = item.fileName;
        omitFileItem.fileSize = item.fileSize;
        omitFileItem.mineType = item.mineType;
        omitFileItem.fieldname = item.fieldname;
        omitFileItem.encoding = item.encoding;
        return omitFileItem;
      });
      response.data.list = omitFileList;
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id查询实验提交, 不包含文件' })
  @ApiParam({ name: 'id', description: '实验提交id' })
  async findOne(@Param('id') id: string): Promise<QueryResponse> {
    const response: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      const res = await this.experimentSubmitService.findOne(+id);
      response.data.list = res ? [res] : [];
      // 如果list不为空，去除list中的file字段
      if (response.data.list.length > 0) {
        const omitFileItem = new OmitFileExperimentSubmitDto();
        omitFileItem.id = response.data.list[0].id;
        omitFileItem.experimentId = response.data.list[0].experimentId;
        omitFileItem.studentId = response.data.list[0].studentId;
        omitFileItem.timeStamp = response.data.list[0].timeStamp;
        omitFileItem.fileUrl = response.data.list[0].fileUrl;
        omitFileItem.fileName = response.data.list[0].fileName;
        omitFileItem.fileSize = response.data.list[0].fileSize;
        omitFileItem.mineType = response.data.list[0].mineType;
        omitFileItem.fieldname = response.data.list[0].fieldname;
        omitFileItem.encoding = response.data.list[0].encoding;
        response.data.list[0] = omitFileItem;
      }
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据id删除实验提交' })
  @ApiParam({ name: 'id', description: '实验提交id' })
  async remove(@Param('id') id: string): Promise<DeleteResponse> {
    const response: DeleteResponse = {
      success: true,
      data: {
        raw: {},
        affected: 0,
      },
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      response.data = await this.experimentSubmitService.remove(+id);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }
}
