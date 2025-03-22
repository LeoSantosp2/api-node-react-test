/*
  Warnings:

  - You are about to drop the column `fine` on the `RentedBooks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `RentedBooks` DROP COLUMN `fine`,
    ADD COLUMN `late` INTEGER NULL;
