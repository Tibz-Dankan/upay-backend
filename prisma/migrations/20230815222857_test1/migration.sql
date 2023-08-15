/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3);
