import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
  imports: [UserModule],
})
export class LoginModule {}
