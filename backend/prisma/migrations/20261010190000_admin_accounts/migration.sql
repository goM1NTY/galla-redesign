CREATE TABLE "admin_users" ("id" TEXT NOT NULL, "email" TEXT NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true, "codeHash" TEXT, "codeExpiresAt" TIMESTAMP(3), "codeAttempts" INTEGER NOT NULL DEFAULT 0, "codeRequestedAt" TIMESTAMP(3), CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");
CREATE TABLE "admin_sessions" ("id" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "userId" TEXT NOT NULL, CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "admin_sessions_tokenHash_key" ON "admin_sessions"("tokenHash");
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
INSERT INTO "admin_users" ("id", "email") VALUES ('admin-mineta', 'minetamexhiti01@gmail.com'), ('admin-medjiti', 'n.medjiti@gmail.com'), ('admin-besnik', 'besnik.fetai1995@gmail.com');
