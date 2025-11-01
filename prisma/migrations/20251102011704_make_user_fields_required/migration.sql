-- AlterTable
-- dateOfBirth, gender, height, weight, sido, guGun을 필수 필드로 변경
-- 기존 데이터가 있는 경우를 위해 기본값을 설정하고 NOT NULL 제약 조건 추가

-- 먼저 NULL 값이 있는 경우 기본값 설정
UPDATE "users" SET "dateOfBirth" = '1990-01-01'::timestamp WHERE "dateOfBirth" IS NULL;
UPDATE "users" SET "gender" = 'MALE' WHERE "gender" IS NULL;
UPDATE "users" SET "height" = 170.0 WHERE "height" IS NULL;
UPDATE "users" SET "weight" = 70.0 WHERE "weight" IS NULL;
UPDATE "users" SET "sido" = '서울특별시' WHERE "sido" IS NULL;
UPDATE "users" SET "guGun" = '강남구' WHERE "guGun" IS NULL;

-- NOT NULL 제약 조건 추가
ALTER TABLE "users" 
  ALTER COLUMN "dateOfBirth" SET NOT NULL,
  ALTER COLUMN "gender" SET NOT NULL,
  ALTER COLUMN "height" SET NOT NULL,
  ALTER COLUMN "weight" SET NOT NULL,
  ALTER COLUMN "sido" SET NOT NULL,
  ALTER COLUMN "guGun" SET NOT NULL;

