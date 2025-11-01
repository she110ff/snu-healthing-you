import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Region Code (e2e)', () => {
  let app: INestApplication;

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
      { code: '11140', name: '서울특별시 중구', regionCode: '11' },
      { code: '11170', name: '서울특별시 용산구', regionCode: '11' },
      { code: '11200', name: '서울특별시 성동구', regionCode: '11' },
      { code: '11215', name: '서울특별시 광진구', regionCode: '11' },
      { code: '11230', name: '서울특별시 동대문구', regionCode: '11' },
      { code: '11260', name: '서울특별시 중랑구', regionCode: '11' },
      { code: '11290', name: '서울특별시 성북구', regionCode: '11' },
      { code: '11305', name: '서울특별시 강북구', regionCode: '11' },
      { code: '11320', name: '서울특별시 도봉구', regionCode: '11' },
      { code: '11350', name: '서울특별시 노원구', regionCode: '11' },
      { code: '11380', name: '서울특별시 은평구', regionCode: '11' },
      { code: '11410', name: '서울특별시 서대문구', regionCode: '11' },
      { code: '11440', name: '서울특별시 마포구', regionCode: '11' },
      { code: '11470', name: '서울특별시 양천구', regionCode: '11' },
      { code: '11500', name: '서울특별시 강서구', regionCode: '11' },
      { code: '11530', name: '서울특별시 구로구', regionCode: '11' },
      { code: '11545', name: '서울특별시 금천구', regionCode: '11' },
      { code: '11560', name: '서울특별시 영등포구', regionCode: '11' },
      { code: '11590', name: '서울특별시 동작구', regionCode: '11' },
      { code: '11620', name: '서울특별시 관악구', regionCode: '11' },
      { code: '11650', name: '서울특별시 서초구', regionCode: '11' },
      { code: '11680', name: '서울특별시 강남구', regionCode: '11' },
      { code: '11710', name: '서울특별시 송파구', regionCode: '11' },
      { code: '11740', name: '서울특별시 강동구', regionCode: '11' },
      { code: '26000', name: '부산광역시', regionCode: '26' },
      { code: '26110', name: '부산광역시 중구', regionCode: '26' },
      { code: '26140', name: '부산광역시 서구', regionCode: '26' },
      { code: '26170', name: '부산광역시 동구', regionCode: '26' },
      { code: '26200', name: '부산광역시 영도구', regionCode: '26' },
      { code: '26230', name: '부산광역시 부산진구', regionCode: '26' },
      { code: '26260', name: '부산광역시 동래구', regionCode: '26' },
      { code: '26290', name: '부산광역시 남구', regionCode: '26' },
      { code: '26320', name: '부산광역시 북구', regionCode: '26' },
      { code: '26350', name: '부산광역시 해운대구', regionCode: '26' },
      { code: '26380', name: '부산광역시 사하구', regionCode: '26' },
      { code: '26410', name: '부산광역시 금정구', regionCode: '26' },
      { code: '26440', name: '부산광역시 강서구', regionCode: '26' },
      { code: '26470', name: '부산광역시 연제구', regionCode: '26' },
      { code: '26500', name: '부산광역시 수영구', regionCode: '26' },
      { code: '26530', name: '부산광역시 사상구', regionCode: '26' },
      { code: '26710', name: '부산광역시 기장군', regionCode: '26' },
    ];

    for (const detail of regionDetails) {
      await prisma.regionDetail.upsert({
        where: { code: detail.code },
        update: { name: detail.name, regionCode: detail.regionCode },
        create: detail,
      });
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/region-codes', () => {
    it('모든 시도(SQ1) 목록을 조회할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/region-codes')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('code');
      expect(response.body[0]).toHaveProperty('name');
      
      // 서울이 포함되어 있는지 확인
      const seoul = response.body.find((region: any) => region.code === '11');
      expect(seoul).toBeDefined();
      expect(seoul.name).toBe('서울');
    });
  });

  describe('GET /api/v1/region-codes/:sq1/details', () => {
    it('특정 시도 코드에 속하는 시군구 목록을 조회할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/region-codes/11/details')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('code');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('regionCode');
      expect(response.body[0]).toHaveProperty('regionName');
      
      // 모든 항목이 서울(11)에 속하는지 확인
      response.body.forEach((detail: any) => {
        expect(detail.regionCode).toBe('11');
        expect(detail.regionName).toBe('서울');
        // RR_SQ2 코드의 앞 두 자리가 11인지 확인
        expect(detail.code.substring(0, 2)).toBe('11');
      });

      // 서울특별시와 강남구가 포함되어 있는지 확인
      const seoul = response.body.find((detail: any) => detail.code === '11000');
      expect(seoul).toBeDefined();
      expect(seoul.name).toBe('서울특별시');

      const gangnam = response.body.find((detail: any) => detail.code === '11680');
      expect(gangnam).toBeDefined();
      expect(gangnam.name).toBe('서울특별시 강남구');
    });

    it('존재하지 않는 시도 코드로 조회 시 404를 반환해야 함', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/region-codes/99/details')
        .expect(404);
    });

    it('부산 지역 코드로 조회할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/region-codes/26/details')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // 모든 항목이 부산(26)에 속하는지 확인
      response.body.forEach((detail: any) => {
        expect(detail.regionCode).toBe('26');
        expect(detail.regionName).toBe('부산');
        expect(detail.code.substring(0, 2)).toBe('26');
      });

      const busan = response.body.find((detail: any) => detail.code === '26000');
      expect(busan).toBeDefined();
      expect(busan.name).toBe('부산광역시');
    });
  });

  describe('GET /api/v1/region-codes/details/:rrSq2', () => {
    it('특정 시군구 코드로 상세 정보를 조회할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/region-codes/details/11000')
        .expect(200);

      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('regionCode');
      expect(response.body).toHaveProperty('regionName');
      
      expect(response.body.code).toBe('11000');
      expect(response.body.name).toBe('서울특별시');
      expect(response.body.regionCode).toBe('11');
      expect(response.body.regionName).toBe('서울');
    });

    it('강남구 코드로 상세 정보를 조회할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/region-codes/details/11680')
        .expect(200);

      expect(response.body.code).toBe('11680');
      expect(response.body.name).toBe('서울특별시 강남구');
      expect(response.body.regionCode).toBe('11');
      expect(response.body.regionName).toBe('서울');
    });

    it('존재하지 않는 시군구 코드로 조회 시 404를 반환해야 함', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/region-codes/details/99999')
        .expect(404);
    });

    it('부산 지역의 시군구 코드로 조회할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/region-codes/details/26000')
        .expect(200);

      expect(response.body.code).toBe('26000');
      expect(response.body.name).toBe('부산광역시');
      expect(response.body.regionCode).toBe('26');
      expect(response.body.regionName).toBe('부산');
    });
  });
});

