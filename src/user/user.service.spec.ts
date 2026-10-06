import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: any;

  const mockUser = {
    id: 1,
    name: 'Test User',
    password: 'hashedpassword',
    email: 'test@example.com',
    phone: '1234567890',
    status: 1,
    role: 1,
    create_time: new Date(),
    update_time: new Date(),
    last_login_time: new Date(),
    ip: '127.0.0.1',
  };

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

    it('should create user with password', async () => {
      const createUserDto = {
        id: 123,
        name: 'Test User',
        password: 'password123',
        email: 'test@example.com',
      };
      const result = await service.create(createUserDto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });

    it('should return empty array when no users', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findAllAndCount', () => {
    it('should return users with count', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockUser], 1]);
      const result = await service.findAllAndCount();
      expect(mockRepository.findAndCount).toHaveBeenCalled();
      expect(result[0]).toEqual([mockUser]);
      expect(result[1]).toBe(1);
    });

    it('should return empty array with zero count', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);
      const result = await service.findAllAndCount();
      expect(mockRepository.findAndCount).toHaveBeenCalled();
      expect(result[0]).toEqual([]);
      expect(result[1]).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await service.findOne(1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });

    it('should return undefined when user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(undefined);
      const result = await service.findOne(999);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const updateUserDto = { name: 'Updated Name' };
      const result = await service.update(1, updateUserDto);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual({ affected: 1 });
    });

    it('should update user with multiple fields', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const updateUserDto = {
        name: 'Updated Name',
        email: 'newemail@example.com',
      };
      const result = await service.update(1, updateUserDto);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });

    it('should return affected 0 when user not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });
      const result = await service.remove(999);
      expect(mockRepository.delete).toHaveBeenCalledWith(999);
      expect(result).toEqual({ affected: 0 });
    });
  });

  describe('findPage', () => {
    it('should return paginated users', async () => {
      const mockUsers = [mockUser];
      mockRepository.findAndCount.mockResolvedValue([mockUsers, 1]);
      const result = await service.findPage(1, 10);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
      });
      expect(result[0]).toEqual(mockUsers);
      expect(result[1]).toBe(1); // total is data.length
    });

    it('should handle different page sizes', async () => {
      mockRepository.findAndCount.mockResolvedValue([[mockUser], 1]);
      await service.findPage(2, 20);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 20,
        skip: 20,
      });
    });
  });

  describe('findCommon', () => {
    it('should return users with pagination', async () => {
      const queryUserDto = {
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC' as const,
        filter: {},
      };
      mockRepository.findAndCount.mockResolvedValue([[mockUser], 1]);
      const result = await service.findCommon(queryUserDto);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { id: 'ASC' },
        where: {},
      });
      expect(result[0]).toEqual([mockUser]);
      expect(result[1]).toBe(1);
    });

    it('should handle filter conditions', async () => {
      const queryUserDto = {
        page: 1,
        limit: 10,
        sort: 'name',
        order: 'DESC' as const,
        filter: { role: 1 },
      };
      mockRepository.findAndCount.mockResolvedValue([[mockUser], 1]);
      await service.findCommon(queryUserDto);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: { name: 'DESC' },
        where: { role: 1 },
      });
    });

    it('should handle custom sort and order', async () => {
      const queryUserDto = {
        page: 2,
        limit: 5,
        sort: 'create_time',
        order: 'DESC' as const,
        filter: { status: 1 },
      };
      mockRepository.findAndCount.mockResolvedValue([[mockUser], 1]);
      await service.findCommon(queryUserDto);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: 5,
        skip: 5,
        order: { create_time: 'DESC' },
        where: { status: 1 },
      });
    });
  });
});
