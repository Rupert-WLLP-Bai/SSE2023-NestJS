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

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil My??liwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## TODO
### 2023???1???4???01:14:51
- [ ] 1. ??????????????????????????????, ?????????'src/common/dto'?????????
- [ ] 2. ??????????????????????????????????????????

## ????????????
1. 2023???1???4???13:20:26 async/await?????????
   - ??????: `const query_result = this.userService.findOne(+id);`, ???????????????async/await?????????, ???????????????????????????{}
   - ??????: `const query_result = await this.userService.findOne(+id);`, controller????????????????????????async, ???????????????????????????await 

2. 2023???1???4???20:58:05 
   - ??????: `Nest can't resolve dependencies of the HelloService (?). Please make sure that the argument HelloRepository at index [0] is available in the RootTestModule context.`
   - ??????: ???spec?????????, ????????????HelloRepository, ?????????providers?????????`getRepositoryToken(Hello)`???provider, useValue: {}??????
   - ??????: https://docs.nestjs.com/techniques/database#testing
   - ??????:
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

3. 2023???1???5???13:53:29 LoginController?????????UserService?????????
   - ??????: `Nest can't resolve dependencies of the LoginController (?). Please make sure that the argument UserService at index [0] is available in the RootTestModule context.`
   - ??????: ???login.module.ts???, ??????UserModule; ???user.module.ts???, ??????TypeOrmModule.forFeature([User]), ??????UserService
   - ??????
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

4. 2023???1???5???22:18:33 multipart/form-data
   - ??????: ???????????????????????????multipart/form-data, ??????swagger?????????
   - ??????: ???controller?????????`@ApiConsumes('multipart/form-data')`, `@UseInterceptors(AnyFilesInterceptor())`
   - ?????????????????????:`@types/multer`
   - ????????????: `./src/user/user.controller.ts`
