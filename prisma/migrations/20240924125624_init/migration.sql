/*
  Warnings:

  - You are about to drop the column `scr` on the `Images` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Images" DROP COLUMN "scr",
ADD COLUMN     "imagenUrl" TEXT;
