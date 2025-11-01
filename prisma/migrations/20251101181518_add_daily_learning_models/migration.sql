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

-- CreateIndex
CREATE UNIQUE INDEX "user_learning_progress_userId_learningContentGroupId_key" ON "user_learning_progress"("userId", "learningContentGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_learning_sessions_userId_learningContentGroupId_sessi_key" ON "daily_learning_sessions"("userId", "learningContentGroupId", "sessionDate");

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
