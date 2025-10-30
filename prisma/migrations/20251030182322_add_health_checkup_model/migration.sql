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

-- AddForeignKey
ALTER TABLE "health_checkups" ADD CONSTRAINT "health_checkups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
