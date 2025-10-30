-- AlterTable
ALTER TABLE "users" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "email_verifications" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_email_key" ON "email_verifications"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
