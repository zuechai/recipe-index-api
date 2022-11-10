-- DropForeignKey
ALTER TABLE `methods` DROP FOREIGN KEY `Methods_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeingredients` DROP FOREIGN KEY `RecipeIngredients_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `recipes` DROP FOREIGN KEY `Recipes_userId_fkey`;

-- CreateTable
CREATE TABLE `Collaborators` (
    `recipeId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`recipeId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Methods` ADD CONSTRAINT `Methods_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipes`(`recipeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecipeIngredients` ADD CONSTRAINT `RecipeIngredients_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipes`(`recipeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipes` ADD CONSTRAINT `Recipes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collaborators` ADD CONSTRAINT `Collaborators_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipes`(`recipeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collaborators` ADD CONSTRAINT `Collaborators_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
