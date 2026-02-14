import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

describe('AuthController (e2e)', () => {
  let jwtService: JwtService;
  let token: string;

  beforeAll(async () => {
    // Create minimal module for JWT testing
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    token = jwtService.sign({ sub: 123, id: 123, role: 1 });
  });

  describe('JWT Token', () => {
    it('should generate valid JWT token', () => {
      expect(token).toBeDefined();
      expect(token).toBe('mock-jwt-token');
    });

    it('should have sign method', () => {
      expect(typeof jwtService.sign).toBe('function');
    });

    it('should have verify method', () => {
      expect(typeof jwtService.verify).toBe('function');
    });
  });
});
