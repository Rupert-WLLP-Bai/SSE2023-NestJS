import { Module, Global } from '@nestjs/common';
import { CourseAuthService } from './course-auth.service';

@Global()
@Module({
  providers: [CourseAuthService],
  exports: [CourseAuthService],
})
export class GuardsModule {}
