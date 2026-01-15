-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT,
    "metadata" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "updated_by" TEXT
);

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
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "blocked_at" DATETIME,
    "blocked_by" TEXT,
    "block_reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "last_login_at" DATETIME
);
INSERT INTO "new_users" ("avatar_url", "created_at", "display_name", "email", "email_verification_token", "email_verified", "email_verified_at", "id", "last_login_at", "password_hash", "password_reset_expires", "password_reset_token", "role", "updated_at", "username", "username_changed_at") SELECT "avatar_url", "created_at", "display_name", "email", "email_verification_token", "email_verified", "email_verified_at", "id", "last_login_at", "password_hash", "password_reset_expires", "password_reset_token", "role", "updated_at", "username", "username_changed_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_verification_token_key" ON "users"("email_verification_token");
CREATE UNIQUE INDEX "users_password_reset_token_key" ON "users"("password_reset_token");
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_is_blocked_idx" ON "users"("is_blocked");
CREATE INDEX "users_created_at_idx" ON "users"("created_at");
CREATE INDEX "users_last_login_at_idx" ON "users"("last_login_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");
