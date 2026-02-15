import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginService } from './login.service';
import * as bcrypt from 'bcrypt';

describe('LoginService', () => {
  let service: LoginService;
  let mockUserService: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUserService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return error when user not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);
      const result = await service.login({ id: 123, password: 'password' });

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('10001');
    });

    it('should return error when password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      mockUserService.findOne.mockResolvedValue({
        id: 123,
        password: hashedPassword,
        role: 1,
      });

      const result = await service.login({
        id: 123,
        password: 'wrongpassword',
      });

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('10002');
    });

    it('should return JWT token when login is successful', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      mockUserService.findOne.mockResolvedValue({
        id: 123,
        password: hashedPassword,
        role: 1,
        name: 'Test User',
      });
      mockUserService.update.mockResolvedValue({});

      const result = await service.login({
        id: 123,
        password: 'correctpassword',
      });

      expect(result.success).toBe(true);
      expect(result.data.token).toBe('mock-jwt-token');
      expect(result.data.currentAuthority).toBe('student');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 123,
        id: 123,
        role: 1,
      });
    });
  });
});
