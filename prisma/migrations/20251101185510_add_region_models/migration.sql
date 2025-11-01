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
CREATE INDEX "region_details_regionCode_idx" ON "region_details"("regionCode");

-- AddForeignKey
ALTER TABLE "region_details" ADD CONSTRAINT "region_details_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "regions"("code") ON DELETE CASCADE ON UPDATE CASCADE;
