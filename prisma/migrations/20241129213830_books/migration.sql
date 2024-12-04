-- DropForeignKey
ALTER TABLE `BooksCopy` DROP FOREIGN KEY `BooksCopy_book_id_fkey`;

-- AddForeignKey
ALTER TABLE `BooksCopy` ADD CONSTRAINT `BooksCopy_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
