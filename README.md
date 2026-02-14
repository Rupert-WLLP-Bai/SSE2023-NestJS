<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

> **注意：该项目已迁移到 [Bun](https://bun.sh/) 包管理器，不再使用 pnpm/npm。**

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
# 使用 bun 安装依赖
$ bun install
```

## Running the app

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Test

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## TODO
### 2023年1月4日01:14:51
- [ ] 1. 添加返回值的统一定义, 存放在'src/common/dto'目录下
- [ ] 2. 完善分页查询和排序条件的封装

## 踩坑记录
1. 2023年1月4日13:20:26 async/await的问题
   - 问题: `const query_result = this.userService.findOne(+id);`, 如果不写成async/await的形式, 数据库的查询结果是{}
   - 解决: `const query_result = await this.userService.findOne(+id);`, controller层的方法前面加上async, 并且在方法内部使用await 

2. 2023年1月4日20:58:05 
   - 问题: `Nest can't resolve dependencies of the HelloService (?). Please make sure that the argument HelloRepository at index [0] is available in the RootTestModule context.`
   - 解决: 在spec文件中, 需要引入HelloRepository, 并且在providers中添加`getRepositoryToken(Hello)`的provider, useValue: {}即可
   - 参考: https://docs.nestjs.com/techniques/database#testing
   - 代码:
      ```ts
      import { Test, TestingModule } from '@nestjs/testing';
      import { getRepositoryToken } from '@nestjs/typeorm';
      import { User } from './entities/user.entity';
      import { UserService } from './user.service';

      describe('UserService', () => {
        let service: UserService;

        beforeEach(async () => {
          const module: TestingModule = await Test.createTestingModule({
            providers: [
              UserService,
              {
                provide: getRepositoryToken(User),
                useValue: {},
              },
            ],
          }).compile();

          service = module.get<UserService>(UserService);
        });

        it('should be defined', () => {
          expect(service).toBeDefined();
        });
      });
      ```

3. 2023年1月5日13:53:29 LoginController中使用UserService的问题
   - 问题: `Nest can't resolve dependencies of the LoginController (?). Please make sure that the argument UserService at index [0] is available in the RootTestModule context.`
   - 解决: 在login.module.ts中, 导入UserModule; 在user.module.ts中, 导入TypeOrmModule.forFeature([User]), 导出UserService
   - 代码
     - user.module.ts
      ```ts
      @Module({
        imports: [TypeOrmModule.forFeature([User])],
        controllers: [UserController],
        providers: [UserService],
        exports: [UserService],
      })
      export class UserModule {}
      ```
      - login.module.ts
      ```ts
      @Module({
        controllers: [LoginController],
        providers: [LoginService],
        imports: [UserModule],
      })
      export class LoginModule {}
      ```

4. 2023年1月5日22:18:33 multipart/form-data
   - 问题: 如何将传参方式改为multipart/form-data, 并在swagger中显示
   - 解决: 在controller上加上`@ApiConsumes('multipart/form-data')`, `@UseInterceptors(AnyFilesInterceptor())`
   - 需要安装的依赖:`@types/multer`
   - 代码参考: `./src/user/user.controller.ts`
