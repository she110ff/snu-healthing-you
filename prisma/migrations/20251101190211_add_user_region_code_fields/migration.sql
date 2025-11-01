-- AlterTable
ALTER TABLE "users" ADD COLUMN     "guGunCode" TEXT,
ADD COLUMN     "sidoCode" TEXT;

-- 데이터 마이그레이션: 기존 sido 값을 Region code로 변환
UPDATE "users" u
SET "sidoCode" = (
  SELECT r.code
  FROM "regions" r
  WHERE 
    -- 정확한 이름 매칭
    r.name = u.sido
    OR
    -- 부분 매칭 (예: "서울특별시" -> "서울")
    (
      (u.sido LIKE '%서울%' AND r.code = '11')
      OR (u.sido LIKE '%부산%' AND r.code = '26')
      OR (u.sido LIKE '%대구%' AND r.code = '27')
      OR (u.sido LIKE '%인천%' AND r.code = '28')
      OR (u.sido LIKE '%광주%' AND r.code = '29')
      OR (u.sido LIKE '%대전%' AND r.code = '30')
      OR (u.sido LIKE '%울산%' AND r.code = '31')
      OR (u.sido LIKE '%경기%' AND r.code = '41')
      OR (u.sido LIKE '%강원%' AND r.code = '51')
      OR (u.sido LIKE '%충북%' AND r.code = '43')
      OR (u.sido LIKE '%충남%' AND r.code = '44')
      OR (u.sido LIKE '%전북%' AND r.code = '52')
      OR (u.sido LIKE '%전남%' AND r.code = '46')
      OR (u.sido LIKE '%경북%' AND r.code = '47')
      OR (u.sido LIKE '%경남%' AND r.code = '48')
      OR (u.sido LIKE '%세종%' AND r.code = '36')
      OR (u.sido LIKE '%제주%' AND r.code = '50')
    )
)
WHERE u."sidoCode" IS NULL;

-- 데이터 마이그레이션: 기존 guGun 값을 RegionDetail code로 변환
UPDATE "users" u
SET "guGunCode" = (
  SELECT rd.code
  FROM "region_details" rd
  WHERE rd.name LIKE '%' || u."guGun" || '%'
  LIMIT 1
)
WHERE u."guGunCode" IS NULL AND u."guGun" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_sidoCode_fkey" FOREIGN KEY ("sidoCode") REFERENCES "regions"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_guGunCode_fkey" FOREIGN KEY ("guGunCode") REFERENCES "region_details"("code") ON DELETE SET NULL ON UPDATE CASCADE;
