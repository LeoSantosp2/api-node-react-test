-- CreateTable
CREATE TABLE `RentedBooks` (
    `id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `copy_code` VARCHAR(191) NOT NULL,
    `rent_date` DATETIME(3) NOT NULL,
    `return_date` DATETIME(3) NULL,
    `limit_date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `fine` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RentedBooks` ADD CONSTRAINT `RentedBooks_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Clients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentedBooks` ADD CONSTRAINT `RentedBooks_copy_code_fkey` FOREIGN KEY (`copy_code`) REFERENCES `BooksCopy`(`copy_code`) ON DELETE CASCADE ON UPDATE CASCADE;
