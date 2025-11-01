-- CreateTable
CREATE TABLE "user_interest_groups" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningContentGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_interest_groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_interest_groups_userId_key" ON "user_interest_groups"("userId");

-- AddForeignKey
ALTER TABLE "user_interest_groups" ADD CONSTRAINT "user_interest_groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_groups" ADD CONSTRAINT "user_interest_groups_learningContentGroupId_fkey" FOREIGN KEY ("learningContentGroupId") REFERENCES "learning_content_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable (기존 interest_groups 테이블 삭제)
DROP TABLE IF EXISTS "interest_groups";

