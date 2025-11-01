-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "approvedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "sido" TEXT,
    "guGun" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "health_checkups" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkupDate" TIMESTAMP(3),
    "bmi" DOUBLE PRECISION,
    "waistCircumference" DOUBLE PRECISION,
    "systolicBloodPressure" INTEGER,
    "diastolicBloodPressure" INTEGER,
    "totalCholesterol" INTEGER,
    "hdlCholesterol" INTEGER,
    "ldlCholesterol" INTEGER,
    "triglycerides" INTEGER,
    "hemoglobin" DOUBLE PRECISION,
    "ast" INTEGER,
    "alt" INTEGER,
    "serumCreatinine" DOUBLE PRECISION,
    "glomerularFiltrationRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_checkups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disease_histories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chronicDiseases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "chronicRespiratoryDiseases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "chronicRespiratoryOther" TEXT,
    "chronicArthritis" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "osteoarthritis" TEXT,
    "chronicArthritisOther" TEXT,
    "pastChronicDiseases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cancerHistory" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cancerOther" TEXT,
    "isSmoking" TEXT,
    "isDrinking" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disease_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interest_groups" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interest_groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_name_key" ON "admins"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_email_key" ON "email_verifications"("email");

-- CreateIndex
CREATE UNIQUE INDEX "institution_configs_name_key" ON "institution_configs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "institution_configs_emailForm_key" ON "institution_configs"("emailForm");

-- CreateIndex
CREATE UNIQUE INDEX "disease_histories_userId_key" ON "disease_histories"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "interest_groups_userId_key" ON "interest_groups"("userId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_checkups" ADD CONSTRAINT "health_checkups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disease_histories" ADD CONSTRAINT "disease_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interest_groups" ADD CONSTRAINT "interest_groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
