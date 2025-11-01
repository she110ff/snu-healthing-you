-- CreateEnum
CREATE TYPE "ContentItemType" AS ENUM ('SPEECH_BUBBLE', 'TEXT', 'IMAGE', 'DATE', 'LABEL_TEXT_FIELD', 'CHECKBOX', 'QNA');

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
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "sidoCode" TEXT NOT NULL,
    "guGunCode" TEXT NOT NULL,
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
CREATE TABLE "user_interest_groups" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningContentGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_interest_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_content_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "learning_content_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "learningContentGroupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contents" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "pageTitle" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_content_items" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "type" "ContentItemType" NOT NULL,
    "order" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "step_content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_learning_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningContentGroupId" TEXT NOT NULL,
    "currentTopicId" TEXT,
    "currentContentId" TEXT,
    "currentStepId" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_learning_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_learning_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningContentGroupId" TEXT NOT NULL,
    "userProgressId" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicsCompleted" INTEGER NOT NULL DEFAULT 0,
    "contentsCompleted" INTEGER NOT NULL DEFAULT 0,
    "stepsCompleted" INTEGER NOT NULL DEFAULT 0,
    "lastLearningAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_learning_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "region_details" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "region_details_pkey" PRIMARY KEY ("code")
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
CREATE UNIQUE INDEX "user_interest_groups_userId_key" ON "user_interest_groups"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_learning_progress_userId_learningContentGroupId_key" ON "user_learning_progress"("userId", "learningContentGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_learning_sessions_userId_learningContentGroupId_sessi_key" ON "daily_learning_sessions"("userId", "learningContentGroupId", "sessionDate");

-- CreateIndex
CREATE INDEX "region_details_regionCode_idx" ON "region_details"("regionCode");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_sidoCode_fkey" FOREIGN KEY ("sidoCode") REFERENCES "regions"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_guGunCode_fkey" FOREIGN KEY ("guGunCode") REFERENCES "region_details"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_checkups" ADD CONSTRAINT "health_checkups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disease_histories" ADD CONSTRAINT "disease_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_groups" ADD CONSTRAINT "user_interest_groups_learningContentGroupId_fkey" FOREIGN KEY ("learningContentGroupId") REFERENCES "learning_content_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_groups" ADD CONSTRAINT "user_interest_groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_learningContentGroupId_fkey" FOREIGN KEY ("learningContentGroupId") REFERENCES "learning_content_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_content_items" ADD CONSTRAINT "step_content_items_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_learning_progress" ADD CONSTRAINT "user_learning_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_learning_progress" ADD CONSTRAINT "user_learning_progress_learningContentGroupId_fkey" FOREIGN KEY ("learningContentGroupId") REFERENCES "learning_content_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_learning_progress" ADD CONSTRAINT "user_learning_progress_currentTopicId_fkey" FOREIGN KEY ("currentTopicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_learning_progress" ADD CONSTRAINT "user_learning_progress_currentContentId_fkey" FOREIGN KEY ("currentContentId") REFERENCES "contents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_learning_progress" ADD CONSTRAINT "user_learning_progress_currentStepId_fkey" FOREIGN KEY ("currentStepId") REFERENCES "steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_learning_sessions" ADD CONSTRAINT "daily_learning_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_learning_sessions" ADD CONSTRAINT "daily_learning_sessions_learningContentGroupId_fkey" FOREIGN KEY ("learningContentGroupId") REFERENCES "learning_content_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_learning_sessions" ADD CONSTRAINT "daily_learning_sessions_userProgressId_fkey" FOREIGN KEY ("userProgressId") REFERENCES "user_learning_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "region_details" ADD CONSTRAINT "region_details_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "regions"("code") ON DELETE CASCADE ON UPDATE CASCADE;
