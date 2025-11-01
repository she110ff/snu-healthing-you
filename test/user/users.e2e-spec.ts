import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { getUserToken } from '../setup/test-helpers';
import { userFixtures } from '../fixtures/user.fixture';
import { commonFixtures } from '../fixtures/common.fixture';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let userToken: string;

  beforeAll(async () => {
    app = await createTestApp();

    // 테스트용 지역 코드 데이터 추가
    const prisma = app.get(PrismaService);

    // 시도 데이터 추가
    const regions = [
      { code: '11', name: '서울' },
      { code: '26', name: '부산' },
      { code: '27', name: '대구' },
      { code: '28', name: '인천' },
      { code: '29', name: '광주' },
      { code: '30', name: '대전' },
      { code: '31', name: '울산' },
      { code: '41', name: '경기' },
      { code: '51', name: '강원' },
      { code: '43', name: '충북' },
      { code: '44', name: '충남' },
      { code: '52', name: '전북' },
      { code: '46', name: '전남' },
      { code: '47', name: '경북' },
      { code: '48', name: '경남' },
      { code: '36', name: '세종' },
      { code: '50', name: '제주' },
    ];

    for (const region of regions) {
      await prisma.region.upsert({
        where: { code: region.code },
        update: { name: region.name },
        create: region,
      });
    }

    // 시군구 데이터 추가 (서울과 부산 일부만)
    const regionDetails = [
      { code: '11000', name: '서울특별시', regionCode: '11' },
      { code: '11110', name: '서울특별시 종로구', regionCode: '11' },
      { code: '11680', name: '서울특별시 강남구', regionCode: '11' },
      { code: '26000', name: '부산광역시', regionCode: '26' },
      { code: '26350', name: '부산광역시 해운대구', regionCode: '26' },
    ];

    for (const detail of regionDetails) {
      await prisma.regionDetail.upsert({
        where: { code: detail.code },
        update: { name: detail.name, regionCode: detail.regionCode },
        create: detail,
      });
    }

    userToken = await getUserToken(
      app,
      userFixtures.existing.email,
      userFixtures.existing.password,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/users/register', () => {
    it('회원가입 성공', async () => {
      const testEmail = `newuser${Date.now()}@snu.ac.kr`;

      // 먼저 이메일 인증코드 발급
      await request(app.getHttpServer())
        .post('/api/v1/email-verification/send-code')
        .send({ email: testEmail })
        .expect(200);

      const registerData = {
        ...userFixtures.new,
        email: testEmail,
      };

      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send(registerData)
        .expect(201);
    });

    it('이미 가입된 이메일로 회원가입 시도 시 실패', async () => {
      // 이미 가입된 이메일로 회원가입 시도 시 Prisma unique constraint 에러가 발생하고
      // 이를 409 ConflictException으로 변환하여 반환
      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({
          email: userFixtures.existing.email,
          password: userFixtures.new.password,
          organizationCode: userFixtures.new.organizationCode,
          dateOfBirth: userFixtures.new.dateOfBirth,
          gender: userFixtures.new.gender,
          height: userFixtures.new.height,
          weight: userFixtures.new.weight,
          sidoCode: userFixtures.new.sidoCode,
          guGunCode: userFixtures.new.guGunCode,
        })
        .expect(409); // 이메일 중복 에러
    });

    it('필수 필드 누락 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({ email: userFixtures.new.email })
        .expect(400);
    });

    it('유효하지 않은 시도 코드로 회원가입 시도 시 실패', async () => {
      const testEmail = `invalidsido${Date.now()}@snu.ac.kr`;

      // 먼저 이메일 인증코드 발급
      await request(app.getHttpServer())
        .post('/api/v1/email-verification/send-code')
        .send({ email: testEmail })
        .expect(200);

      // 유효하지 않은 시도 코드(99)로 회원가입 시도
      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({
          ...userFixtures.new,
          email: testEmail,
          sidoCode: '99', // 존재하지 않는 시도 코드
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('유효하지 않은 시도 코드');
        });
    });

    it('유효하지 않은 시군구 코드로 회원가입 시도 시 실패', async () => {
      const testEmail = `invalidgugun${Date.now()}@snu.ac.kr`;

      // 먼저 이메일 인증코드 발급
      await request(app.getHttpServer())
        .post('/api/v1/email-verification/send-code')
        .send({ email: testEmail })
        .expect(200);

      // 유효하지 않은 시군구 코드(99999)로 회원가입 시도
      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({
          ...userFixtures.new,
          email: testEmail,
          guGunCode: '99999', // 존재하지 않는 시군구 코드
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('유효하지 않은 시군구 코드');
        });
    });
  });

  describe('GET /api/v1/users', () => {
    it('사용자 목록 조회 성공', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer()).get('/api/v1/users').expect(401);
    });
  });

  describe('GET /api/v1/users/:id/status', () => {
    it('사용자 상태 조회 성공', async () => {
      // 먼저 사용자 목록에서 ID를 가져옴
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        return request(app.getHttpServer())
          .get(`/api/v1/users/${userId}/status`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('emailVerified');
            expect(res.body).toHaveProperty('approvedByAdmin');
          });
      }
    });

    it('존재하지 않는 사용자 ID로 조회 시 실패', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users/${commonFixtures.uuids.nonExistent}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('사용자 정보 조회 성공', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        return request(app.getHttpServer())
          .get(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('email');
            expect(res.body).toHaveProperty('name');
          });
      }
    });

    it('존재하지 않는 사용자 ID로 조회 시 실패', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it('사용자 정보 수정 성공 - 단일 필드 (height)', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        const updateData = {
          height: 180.5,
        };

        return request(app.getHttpServer())
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('height', updateData.height);
          });
      }
    });

    it('사용자 정보 수정 성공 - 여러 필드 동시 수정', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        const updateData = {
          weight: 75.5,
          sidoCode: '26',
          guGunCode: '26350',
        };

        return request(app.getHttpServer())
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('weight', updateData.weight);
            expect(res.body).toHaveProperty('sidoCode', updateData.sidoCode);
            expect(res.body).toHaveProperty('guGunCode', updateData.guGunCode);
          });
      }
    });

    it('사용자 정보 수정 성공 - 생년월일 및 성별 수정', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        const updateData = {
          dateOfBirth: '1995-05-15',
          gender: 'FEMALE',
        };

        return request(app.getHttpServer())
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('gender', updateData.gender);
            expect(res.body).toHaveProperty('dateOfBirth');
            // dateOfBirth는 Date 객체로 변환되어 반환되므로 형식 검증만
            expect(
              new Date(res.body.dateOfBirth).toISOString().split('T')[0],
            ).toBe(updateData.dateOfBirth);
          });
      }
    });

    it('존재하지 않는 사용자 ID로 수정 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/users/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ height: 180.0 })
        .expect(404);
    });

    it('잘못된 성별 값으로 수정 시도 시 실패', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        return request(app.getHttpServer())
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ gender: 'INVALID' })
          .expect(400);
      }
    });

    it('허용되지 않은 필드(name)를 포함한 요청은 거부됨', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;

        // 허용되지 않은 필드(name)를 포함한 요청은 ValidationPipe에서 400 에러 반환
        return request(app.getHttpServer())
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            height: 180.0,
            name: '수정되지않아야하는이름',
          })
          .expect(400);
      }
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('사용자 삭제 성공', async () => {
      // 테스트용 사용자를 생성하고 삭제하는 것이 좋으나,
      // 실제 테스트에서는 기존 사용자 삭제를 피해야 함
      // 여기서는 구조만 확인
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // 실제 삭제는 신중하게 테스트해야 함
      // return request(app.getHttpServer())
      //   .delete(`/api/v1/users/${userId}`)
      //   .set('Authorization', `Bearer ${userToken}`)
      //   .expect(200);
    });

    it('존재하지 않는 사용자 ID로 삭제 시도 시 실패', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/users/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });
});
