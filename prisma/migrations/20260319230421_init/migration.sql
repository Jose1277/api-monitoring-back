-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endpoints" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'GET',
    "headers" JSONB,
    "body" TEXT,
    "interval" INTEGER NOT NULL DEFAULT 300,
    "timeout" INTEGER NOT NULL DEFAULT 10000,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_checks" (
    "id" TEXT NOT NULL,
    "statusCode" INTEGER,
    "responseTime" INTEGER NOT NULL,
    "isUp" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "errorType" TEXT,
    "responseBody" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkDuration" INTEGER,
    "endpointId" TEXT NOT NULL,

    CONSTRAINT "health_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "endpoints_userId_idx" ON "endpoints"("userId");

-- CreateIndex
CREATE INDEX "endpoints_isActive_idx" ON "endpoints"("isActive");

-- CreateIndex
CREATE INDEX "endpoints_userId_isActive_idx" ON "endpoints"("userId", "isActive");

-- CreateIndex
CREATE INDEX "health_checks_endpointId_idx" ON "health_checks"("endpointId");

-- CreateIndex
CREATE INDEX "health_checks_checkedAt_idx" ON "health_checks"("checkedAt");

-- CreateIndex
CREATE INDEX "health_checks_endpointId_checkedAt_idx" ON "health_checks"("endpointId", "checkedAt");

-- CreateIndex
CREATE INDEX "health_checks_endpointId_isUp_idx" ON "health_checks"("endpointId", "isUp");

-- CreateIndex
CREATE INDEX "health_checks_endpointId_checkedAt_isUp_idx" ON "health_checks"("endpointId", "checkedAt", "isUp");

-- AddForeignKey
ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_checks" ADD CONSTRAINT "health_checks_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;
