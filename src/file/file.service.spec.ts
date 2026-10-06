import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('basic service functionality', () => {
    it('should have FileService as injectable', () => {
      expect(service).toBeInstanceOf(FileService);
    });

    it('should be able to instantiate', () => {
      expect(service).toBeDefined();
    });
  });
});
