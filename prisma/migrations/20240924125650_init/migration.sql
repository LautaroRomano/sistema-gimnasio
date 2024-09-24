/*
  Warnings:

  - You are about to drop the column `imagenUrl` on the `Images` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Images" DROP COLUMN "imagenUrl",
ADD COLUMN     "imageUrl" TEXT;
