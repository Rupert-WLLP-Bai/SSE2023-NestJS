import { Injectable, Logger } from '@nestjs/common';
import {
  Repository,
  FindOptionsWhere,
  DeepPartial,
} from 'typeorm';

/**
 * @file BaseService 抽象类
 * @description 提供通用的 CRUD 方法，支持泛型 Entity
 * @author SSE Team
 */
@Injectable()
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class BaseService<T extends Record<string, any>> {
  protected readonly logger: Logger;

  constructor(protected readonly repository: Repository<T>) {
    this.logger = new Logger(repository.metadata.targetName);
  }

  /**
   * 查询所有记录
   */
  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  /**
   * 根据条件查询所有记录
   */
  async findAllBy(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.find({ where });
  }

  /**
   * 分页查询
   */
  async findAndCount(
    page: number = 1,
    limit: number = 10,
  ): Promise<[T[], number]> {
    const take = limit;
    const skip = (page - 1) * limit;
    return this.repository.findAndCount({
      take,
      skip,
    });
  }

  /**
   * 根据 ID 查询单条记录
   */
  async findOne(id: number): Promise<T | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.repository.findOneBy({ id } as any);
  }

  /**
   * 根据自定义条件查询单条记录
   */
  async findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOneBy(where);
  }

  /**
   * 创建记录
   */
  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  /**
   * 更新记录
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: number, updateDto: any): Promise<T> {
    await this.repository.update(id, updateDto);
    return this.findOne(id) as Promise<T>;
  }

  /**
   * 删除记录
   */
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * 软删除记录 (如果实体支持)
   */
  async softDelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  /**
   * 统计记录总数
   */
  async count(): Promise<number> {
    return this.repository.count();
  }

  /**
   * 根据条件统计记录数
   */
  async countBy(where: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count({ where });
  }
}
