import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseAuthService } from './course-auth.service';
import { Course } from '../../course/entities/course.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CourseAuthService],
  exports: [CourseAuthService],
})
export class GuardsModule {}
