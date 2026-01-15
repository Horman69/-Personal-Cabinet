/*
  Warnings:

  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verification_token" TEXT,
    "email_verified_at" DATETIME,
    "password_reset_token" TEXT,
    "password_reset_expires" DATETIME,
    "username_changed_at" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "last_login_at" DATETIME
);
INSERT INTO "new_users" ("avatar_url", "created_at", "email", "email_verification_token", "email_verified", "email_verified_at", "id", "last_login_at", "password_hash", "password_reset_expires", "password_reset_token", "role", "updated_at") SELECT "avatar_url", "created_at", "email", "email_verification_token", "email_verified", "email_verified_at", "id", "last_login_at", "password_hash", "password_reset_expires", "password_reset_token", "role", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_verification_token_key" ON "users"("email_verification_token");
CREATE UNIQUE INDEX "users_password_reset_token_key" ON "users"("password_reset_token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
