import { UserService } from './../user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { User } from '../user/entities/user.entity';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{
          name: 'login',
          limit: 5,
          ttl: 60000,
        }]),
      ],
      controllers: [LoginController],
      providers: [
        LoginService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
