/*
  Warnings:

  - You are about to drop the column `telegram_id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telegram_user_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telegram_user_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_telegram_id_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "telegram_id",
ADD COLUMN     "telegram_user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_telegram_user_id_key" ON "user"("telegram_user_id");
