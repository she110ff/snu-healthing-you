-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_configs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emailForm" TEXT NOT NULL,
    "contactPersonName" TEXT,
    "contactPersonPhone" TEXT,
    "contactPersonEmail" TEXT,
    "businessRegistrationNumber" TEXT,
    "pointPoolTotal" BIGINT NOT NULL,
    "pointPoolRemaining" BIGINT NOT NULL,
    "pointLimitPerUser" INTEGER NOT NULL,
    "affiliationCodes" JSONB NOT NULL,

    CONSTRAINT "institution_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "institution_configs_name_key" ON "institution_configs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "institution_configs_emailForm_key" ON "institution_configs"("emailForm");
