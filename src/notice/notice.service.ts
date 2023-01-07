import { Notice } from './entities/notice.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Repository } from 'typeorm';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  create(createNoticeDto: CreateNoticeDto) {
    return this.noticeRepository.save(createNoticeDto);
  }

  findAll() {
    return this.noticeRepository.find();
  }

  findAllAndCount() {
    return this.noticeRepository.findAndCount();
  }

  findOne(id: number) {
    return this.noticeRepository.findOneBy({ id: id });
  }

  update(id: number, updateNoticeDto: UpdateNoticeDto) {
    return this.noticeRepository.update(id, updateNoticeDto);
  }

  remove(id: number) {
    return this.noticeRepository.delete(id);
  }

  async findPage(page: number, pageSize: number): Promise<[Notice[], number]> {
    const take = pageSize;
    const skip = (page - 1) * pageSize;
    const res = await this.noticeRepository.findAndCount({
      take: take,
      skip: skip,
    });
    const data = res[0];
    const total = data.length;
    return [data, total];
  }
  // 通用查询
  // 1. 分页
  // 2. 条件查询
  // 3. 排序
}
