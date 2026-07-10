-- CreateEnum
CREATE TYPE "CaseType" AS ENUM ('REGULAR', 'TRANSFER_OUT', 'DATA_UPDATE', 'CHANGE_EMPLOYER', 'CHANGE_CAREGIVER');

-- CreateEnum
CREATE TYPE "CaseProcess" AS ENUM ('JOB_POSTING', 'RECRUIT_PERMIT', 'HIRE_PERMIT', 'RESIDENCE_CARD', 'LABOR_CONTRACT');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('PROCESSING', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Country" AS ENUM ('INDONESIA', 'VIETNAM', 'PHILIPPINES', 'THAILAND', 'OTHER');

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "caseType" "CaseType" NOT NULL,
    "employer" TEXT NOT NULL,
    "employerPhone" TEXT NOT NULL,
    "employerContact" TEXT,
    "applicantName" TEXT,
    "country" "Country" NOT NULL,
    "cause" TEXT NOT NULL,
    "currentProcess" "CaseProcess",
    "status" "CaseStatus" NOT NULL DEFAULT 'PROCESSING',
    "assigneeId" TEXT NOT NULL,
    "nextActionDate" TIMESTAMP(3),
    "nextActionNote" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseEvent" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "process" "CaseProcess",
    "action" TEXT NOT NULL,
    "note" TEXT,
    "actorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");

-- CreateIndex
CREATE INDEX "Case_assigneeId_idx" ON "Case"("assigneeId");

-- CreateIndex
CREATE INDEX "Case_status_idx" ON "Case"("status");

-- CreateIndex
CREATE INDEX "Case_nextActionDate_idx" ON "Case"("nextActionDate");

-- CreateIndex
CREATE INDEX "CaseEvent_caseId_idx" ON "CaseEvent"("caseId");

-- CreateIndex
CREATE INDEX "CaseEvent_createdAt_idx" ON "CaseEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseEvent" ADD CONSTRAINT "CaseEvent_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseEvent" ADD CONSTRAINT "CaseEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
