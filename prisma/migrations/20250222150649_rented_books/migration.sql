/*
  Warnings:

  - You are about to alter the column `late` on the `RentedBooks` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `RentedBooks` MODIFY `late` BOOLEAN NULL;
