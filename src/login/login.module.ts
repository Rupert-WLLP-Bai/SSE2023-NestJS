import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { User } from '../user/entities/user.entity';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
  imports: [UserModule, TypeOrmModule.forFeature([User])],
})
export class LoginModule {}
