/*
  Warnings:

  - You are about to drop the column `date_of_bith` on the `Clients` table. All the data in the column will be lost.
  - Added the required column `date_of_birth` to the `Clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Clients` DROP COLUMN `date_of_bith`,
    ADD COLUMN `date_of_birth` DATETIME(3) NOT NULL;
