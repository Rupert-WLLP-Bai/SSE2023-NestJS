import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> | undefined {
    return this.userRepository.find();
  }

  findAllAndCount(): Promise<[User[], number]> | undefined {
    return this.userRepository.findAndCount();
  }

  findOne(id: number): Promise<User> | undefined {
    // 使用id查询
    return this.userRepository.findOneBy({ id: id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  // 分页查询
  async findPage(page: number, pageSize: number): Promise<[User[], number]> {
    const take = pageSize;
    // 跳过的条数
    const skip = (page - 1) * pageSize;
    // 查询数据
    const res = await this.userRepository.findAndCount({
      take: take,
      skip: skip,
    });
    // 需要的得到的是当前页有多少条数据
    const data = res[0];
    // 总条数
    const total = data.length;
    return [data, total];
  }
}
