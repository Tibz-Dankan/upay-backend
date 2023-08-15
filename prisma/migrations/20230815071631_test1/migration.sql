-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SELLER', 'BUYER', 'DRIVER');

-- CreateTable
CREATE TABLE "User" (
    "userIndex" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "password" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userIndex_key" ON "User"("userIndex");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
