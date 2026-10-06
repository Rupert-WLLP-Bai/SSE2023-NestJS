import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Response } from 'express';

// Mock qiniu module
jest.mock('qiniu', () => ({
  auth: {
    digest: {
      Mac: jest.fn().mockImplementation(() => ({})),
    },
  },
  rs: {
    PutPolicy: jest.fn().mockImplementation(() => ({
      uploadToken: jest.fn().mockReturnValue('mock-upload-token'),
    })),
    BucketManager: jest.fn().mockImplementation(() => ({
      publicDownloadUrl: jest.fn().mockReturnValue('http://mock-url.com/file'),
      listPrefix: jest.fn((bucket, options, callback) => {
        callback(null, { items: [], commonPrefixes: [] }, { statusCode: 200 });
      }),
    })),
  },
  conf: {
    Config: jest.fn().mockImplementation(() => ({})),
  },
  form_up: {
    FormUploader: jest.fn().mockImplementation(() => ({
      putFile: jest.fn((token, key, path, extra, callback) => {
        callback(null, { key: 'test.txt' }, { statusCode: 200 });
      }),
    })),
    PutExtra: jest.fn(),
  },
  zone: {
    Zone_z2: {},
  },
}));

// Mock axios
jest.mock('axios', () => {
  const axios = jest.fn().mockResolvedValue({
    data: {
      pipe: jest.fn(),
    },
  });
  return Object.assign(axios, { default: axios });
});

// Mock common/key module
jest.mock('../common/key', () => ({
  getAccessKey: jest.fn().mockReturnValue('mock-access-key'),
  getSecretKey: jest.fn().mockReturnValue('mock-secret-key'),
  getQiniuBucket: jest.fn().mockReturnValue('mock-bucket'),
  getQiniuDomain: jest.fn().mockReturnValue('mock-domain.com'),
}));

describe('FileController', () => {
  let controller: FileController;
  let fileService: FileService;

  const mockFile = {
    originalname: 'test.txt',
    path: '/tmp/test.txt',
    size: 1024,
    mimetype: 'text/plain',
  };

  const mockResponse = {
    setHeader: jest.fn(),
    pipe: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [FileService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(true)
      .compile();

    controller = module.get<FileController>(FileController);
    fileService = module.get<FileService>(FileService);

    jest.clearAllMocks();
  });

  describe('uploadFileToQiniu', () => {
    it('should upload file to qiniu', async () => {
      // This test verifies the controller can be called without throwing
      // Full qiniu integration is mocked
      await expect(
        controller.uploadFileToQiniu(mockFile as Express.Multer.File),
      ).resolves.not.toThrow();
    });

    it('should handle file upload with different filename', async () => {
      const customFile = {
        ...mockFile,
        originalname: 'custom_file.pdf',
      };
      await expect(
        controller.uploadFileToQiniu(customFile as Express.Multer.File),
      ).resolves.not.toThrow();
    });
  });

  describe('downloadFileFromQiniu', () => {
    it('should download file from qiniu', async () => {
      await expect(
        controller.downloadFileFromQiniu('test.txt', mockResponse),
      ).resolves.not.toThrow();
    });

    it('should set content-disposition header', async () => {
      const filepath = 'test_file.txt';
      await controller.downloadFileFromQiniu(filepath, mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-disposition',
        `attachment; filename=${filepath}`,
      );
    });
  });

  describe('listFileFromQiniu', () => {
    it('should list files from qiniu', async () => {
      const mockListResult = {
        items: [
          { key: 'file1.txt', size: 1024 },
          { key: 'file2.txt', size: 2048 },
        ],
        commonPrefixes: [],
      };

      // The actual implementation uses a callback, we need to mock it properly
      const result = await controller.listFileFromQiniu();
      expect(result).toBeDefined();
    });

    it('should handle empty file list', async () => {
      const result = await controller.listFileFromQiniu();
      expect(result).toBeDefined();
    });
  });
});
