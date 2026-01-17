-- CreateEnum
CREATE TYPE "ToolCategory" AS ENUM ('AGENTIC', 'LEGACY');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('PASS', 'FAIL');

-- CreateTable
CREATE TABLE "Tool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "category" "ToolCategory" NOT NULL,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArenaRun" (
    "id" SERIAL NOT NULL,
    "toolId" INTEGER NOT NULL,
    "status" "RunStatus" NOT NULL,
    "stability_score" INTEGER NOT NULL,
    "hallucination_detected" BOOLEAN NOT NULL,
    "raw_logs" JSONB NOT NULL,
    "video_url" TEXT,
    "benchmarkId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArenaRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benchmark" (
    "id" SERIAL NOT NULL,
    "scenario_name" TEXT NOT NULL,
    "difficulty_level" TEXT NOT NULL,

    CONSTRAINT "Benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "runId" INTEGER NOT NULL,
    "verified_by" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trend" (
    "id" SERIAL NOT NULL,
    "market_sentiment" TEXT NOT NULL,
    "tech_stack_flags" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArenaRun" ADD CONSTRAINT "ArenaRun_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArenaRun" ADD CONSTRAINT "ArenaRun_benchmarkId_fkey" FOREIGN KEY ("benchmarkId") REFERENCES "Benchmark"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_runId_fkey" FOREIGN KEY ("runId") REFERENCES "ArenaRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
