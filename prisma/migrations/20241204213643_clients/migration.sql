-- CreateTable
CREATE TABLE `Clients` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `date_of_bith` DATETIME(3) NOT NULL,
    `street_address` VARCHAR(191) NOT NULL,
    `number_address` VARCHAR(191) NOT NULL,
    `complement_address` VARCHAR(191) NOT NULL,
    `neighborhood_address` VARCHAR(191) NOT NULL,
    `city_address` VARCHAR(191) NOT NULL,
    `state_address` VARCHAR(191) NOT NULL,
    `zipcode_address` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Clients_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
