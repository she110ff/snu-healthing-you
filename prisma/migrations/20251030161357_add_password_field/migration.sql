/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "password" TEXT;

-- 기존 데이터에 임시 비밀번호 설정 (bcrypt 해시: "password123")
-- 나중에 실제 비밀번호로 변경해야 합니다
UPDATE "users" SET "password" = '$2b$10$xKDmVso5jL6RBV32/Qh4HetGKtNUlm1upMqS7YAnfxpEBIljzjioa' WHERE "password" IS NULL;

-- 이제 NOT NULL 제약 조건 추가
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;
