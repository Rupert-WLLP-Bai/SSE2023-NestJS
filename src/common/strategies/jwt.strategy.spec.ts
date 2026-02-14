import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy, JwtPayload } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user object with id and role from payload (sub)', async () => {
      const payload: JwtPayload = { sub: 123, id: 456, role: 1 };
      const result = await strategy.validate(payload);

      expect(result).toEqual({ id: 123, role: 1 });
    });

    it('should return user object with id and role from payload (id)', async () => {
      const payload: JwtPayload = { sub: 456, id: 456, role: 2 };
      const result = await strategy.validate(payload);

      expect(result).toEqual({ id: 456, role: 2 });
    });
  });
});
