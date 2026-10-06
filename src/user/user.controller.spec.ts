import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let mockService: any;

  const mockUser = {
    id: 1,
    name: 'Test User',
    password: 'hashedpassword',
    role: 'STUDENT',
    email: 'test@example.com',
    phone: '1234567890',
    status: 1,
    create_time: new Date(),
    update_time: new Date(),
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findAllAndCount: jest.fn(),
      findPage: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findCommon: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('create', () => {
    it('should create user', async () => {
      mockService.create.mockResolvedValue(mockUser);
      const result = await controller.create({} as any);
      expect(result).toEqual(mockUser);
    });

    it('should call service create with DTO', async () => {
      const createDto = { name: 'Test', password: 'password123' };
      mockService.create.mockResolvedValue(mockUser);
      await controller.create(createDto);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      mockService.findOne.mockResolvedValue(mockUser);
      const result = await controller.findOne('1');
      expect(result.list).toEqual([mockUser]);
      expect(result.total).toBe(1);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return list with null when not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      const result = await controller.findOne('999');
      expect(result.list).toEqual([null]);
      expect(result.total).toBe(0);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      mockService.update.mockResolvedValue({ affected: 1 });
      const result = await controller.update('1', {} as any);
      expect(result).toEqual({ affected: 1 });
      expect(mockService.update).toHaveBeenCalledWith(1, {});
    });

    it('should update user with specific fields', async () => {
      mockService.update.mockResolvedValue({ affected: 1 });
      const updateDto = { name: 'New Name', email: 'new@example.com' };
      const result = await controller.update('1', updateDto);
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      mockService.remove.mockResolvedValue({ affected: 1 });
      const result = await controller.remove('1');
      expect(result).toEqual({ affected: 1 });
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });

    it('should return affected 0 when user not found', async () => {
      mockService.remove.mockResolvedValue({ affected: 0 });
      const result = await controller.remove('999');
      expect(result).toEqual({ affected: 0 });
    });
  });

  describe('findPage', () => {
    it('should return paginated users when page and pageSize provided', async () => {
      const mockUsers = [mockUser];
      mockService.findPage.mockResolvedValue([mockUsers, 1]);
      const result = await controller.findPage(1, 10);
      expect(result.list).toEqual(mockUsers);
      expect(result.total).toBe(1);
      expect(result.current).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(mockService.findPage).toHaveBeenCalledWith(1, 10);
    });

    it('should return all users when page not provided', async () => {
      const mockUsers = [mockUser];
      mockService.findAllAndCount.mockResolvedValue([mockUsers, 1]);
      const result = await controller.findPage(undefined, undefined);
      expect(result.list).toEqual(mockUsers);
      expect(result.total).toBe(1);
      expect(mockService.findAllAndCount).toHaveBeenCalled();
    });

    it('should return all users when pageSize not provided', async () => {
      const mockUsers = [mockUser];
      mockService.findAllAndCount.mockResolvedValue([mockUsers, 1]);
      const result = await controller.findPage(1, undefined);
      expect(result.list).toEqual(mockUsers);
      expect(mockService.findAllAndCount).toHaveBeenCalled();
    });
  });

  describe('findCommon', () => {
    it('should return users with query parameters', async () => {
      const mockUsers = [mockUser];
      const queryDto: any = {
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: {},
      };
      mockService.findCommon.mockResolvedValue([mockUsers, 1]);
      const result = await controller.findCommon(queryDto);
      expect(result.list).toEqual(mockUsers);
      expect(result.total).toBe(1);
      expect(result.current).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(mockService.findCommon).toHaveBeenCalledWith(queryDto);
    });

    it('should handle filter conditions', async () => {
      const mockUsers = [mockUser];
      const queryDto: any = {
        page: 2,
        limit: 5,
        sort: 'name',
        order: 'DESC',
        filter: { role: 1 },
      };
      mockService.findCommon.mockResolvedValue([mockUsers, 1]);
      const result = await controller.findCommon(queryDto);
      expect(result.list).toEqual(mockUsers);
      expect(result.current).toBe(2);
      expect(result.pageSize).toBe(5);
    });

    it('should handle empty results', async () => {
      const queryDto: any = {
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'ASC',
        filter: {},
      };
      mockService.findCommon.mockResolvedValue([[], 0]);
      const result = await controller.findCommon(queryDto);
      expect(result.list).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
