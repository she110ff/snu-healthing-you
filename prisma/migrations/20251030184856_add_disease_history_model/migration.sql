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

-- CreateIndex
CREATE UNIQUE INDEX "disease_histories_userId_key" ON "disease_histories"("userId");

-- AddForeignKey
ALTER TABLE "disease_histories" ADD CONSTRAINT "disease_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
