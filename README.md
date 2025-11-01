<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

SNU Healthing You API - NestJS 기반 REST API 서버

## 주요 기능

- ✅ REST API 엔드포인트
- ✅ Swagger/OpenAPI 자동 문서화
- ✅ API 버전 관리 (v1)
- ✅ 유효성 검사 (class-validator)
- ✅ CORS 지원
- ✅ Prisma ORM (PostgreSQL)

## Project setup

### 1. 의존성 설치

```bash
$ npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/snu_healthing_you?schema=public"
```

### 3. PostgreSQL 데이터베이스 생성

PostgreSQL이 설치되어 있어야 합니다. 다음 명령어로 데이터베이스를 생성하세요:

```bash
# PostgreSQL에 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE snu_healthing_you;

# 종료
\q
```

### 4. Prisma 마이그레이션 실행

```bash
# Prisma Client 생성
$ npx prisma generate

# 데이터베이스 마이그레이션 적용
$ npx prisma migrate dev --name init
```

### 5. Prisma Studio (선택사항)

데이터베이스를 시각적으로 확인하려면:

```bash
$ npx prisma studio
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API 문서

서버 실행 후 다음 URL에서 Swagger UI를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:3000/api/docs
- **API 엔드포인트**: http://localhost:3000/api/v1

## API 엔드포인트 구조

모든 API는 `/api/v1` 접두사를 사용합니다:

```
GET    /api/v1          - 헬스 체크
GET    /api/v1/users    - 사용자 목록 조회
POST   /api/v1/users    - 사용자 생성
GET    /api/v1/users/:id - 사용자 조회
PATCH  /api/v1/users/:id - 사용자 수정
DELETE /api/v1/users/:id - 사용자 삭제
```

## Run tests

### 테스트 데이터베이스 설정

E2E 테스트는 자동으로 테스트 전용 데이터베이스를 사용합니다. 테스트 데이터베이스를 생성하세요:

**방법 1: npm 스크립트 사용 (권장)**

```bash
# 테스트 데이터베이스 생성 및 마이그레이션 적용 (한 번에 실행)
$ npm run test:db:setup
```

**방법 2: 단계별 실행**

```bash
# 1. 테스트 데이터베이스 생성
$ npm run test:db:create

# 2. 마이그레이션 적용
$ npm run test:db:migrate
```

**방법 3: 수동으로 SQL 실행**

```bash
# PostgreSQL에 접속
psql -U postgres

# 테스트 데이터베이스 생성
CREATE DATABASE snu_healthing_you_test;

# 종료
\q

# 마이그레이션 적용
$ npm run test:db:migrate
```

**방법 4: SQL 파일 사용**

```bash
psql -U postgres -f scripts/create-test-db.sql
npm run test:db:migrate
```

**참고:**

- 테스트 실행 시 `.env` 파일에 `DATABASE_URL`이 없으면 자동으로 테스트 전용 데이터베이스 URL(`snu_healthing_you_test`)을 사용합니다.
- 환경변수가 이미 설정되어 있으면 그것을 우선 사용합니다.

### 테스트 실행

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
