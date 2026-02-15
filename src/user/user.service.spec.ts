import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      save: jest
        .fn()
        .mockImplementation((user) => Promise.resolve({ ...user, id: 1 })),
      find: jest.fn().mockResolvedValue([]),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password when creating user', async () => {
      const createUserDto = {
        id: 123,
        name: 'Test User',
        password: 'plainpassword',
        update_time: new Date(),
      };
      await service.create(createUserDto);

      // Verify password is hashed
      expect(mockRepository.save).toHaveBeenCalled();
      const savedUser = mockRepository.save.mock.calls[0][0];
      expect(savedUser.password).not.toBe('plainpassword');
      expect(await bcrypt.compare('plainpassword', savedUser.password)).toBe(
        true,
      );
    });

    it('should hash any password provided', async () => {
      const hashedPassword = await bcrypt.hash('alreadyhashed', 10);
      const createUserDto = {
        id: 123,
        name: 'Test User',
        password: hashedPassword,
        update_time: new Date(),
      };
      await service.create(createUserDto);

      // Password gets hashed again (current implementation behavior)
      const savedUser = mockRepository.save.mock.calls[0][0];
      expect(savedUser.password).not.toBe(hashedPassword);
    });
  });
});
