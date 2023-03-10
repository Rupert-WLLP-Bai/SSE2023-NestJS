import { UpdateUserDto } from './../user/dto/update-user.dto';
import { NormalResponse } from './../common/response/response.interface';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { LoginParams } from './dto/login';
import { LoginResponse } from './login.response';
import { loginErrorCodes } from './login.error';
import { getUserRoleName } from '../user/entities/user.entity';

@Injectable()
export class LoginService {
  constructor(private readonly userService: UserService) {}
  // 登录
  async login(loginParams: LoginParams): Promise<LoginResponse> {
    // 定义返回值
    const res: LoginResponse = {
      success: false,
      data: {
        token: '',
        currentAuthority: '',
      },
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };

    // 获取用户信息
    const id = loginParams.id;
    const password = loginParams.password;
    const user = await this.userService.findOne(id);
    // 用户不存在
    if (!user) {
      res.errorCode = loginErrorCodes.USER_NOT_EXIST;
      res.errorMessage = '用户不存在';
      return res;
    }
    // 密码错误
    if (user.password !== password) {
      res.errorCode = loginErrorCodes.PASSWORD_ERROR;
      res.errorMessage = '密码错误';
      return res;
    }
    // 登录成功
    res.success = true;
    res.data.currentAuthority = getUserRoleName(user.role);
    res.data.token = user.id.toString();
    // 修改用户登录时间
    const updateUserDto: UpdateUserDto = {
      last_login_time: new Date(),
    };
    await this.userService.update(user.id, updateUserDto);
    return res;
  }

  // 登出
  async outlogin(): Promise<NormalResponse> {
    // 定义返回值
    const res: NormalResponse = {
      success: false,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    res.success = true;
    return res;
  }
}
