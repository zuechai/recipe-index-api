/*
  Warnings:

  - A unique constraint covering the columns `[ingredient]` on the table `Ingredients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Ingredients_ingredient_key` ON `Ingredients`(`ingredient`);
