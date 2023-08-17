/*
  Warnings:

  - You are about to drop the `_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "_products";

-- DropTable
DROP TABLE "_users";

-- CreateTable
CREATE TABLE "User" (
    "userIndex" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "password" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productIndex" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "specification" TEXT,
    "imageUrl" TEXT,
    "imagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userIndex_key" ON "User"("userIndex");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_productIndex_key" ON "Product"("productIndex");
