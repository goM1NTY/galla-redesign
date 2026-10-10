ALTER TABLE "admin_users" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';
UPDATE "admin_users" SET "name" = CASE "email" WHEN 'minetamexhiti01@gmail.com' THEN 'Mineta Mexhiti' WHEN 'n.medjiti@gmail.com' THEN 'N. Medjiti' WHEN 'besnik.fetai1995@gmail.com' THEN 'Besnik Fetai' ELSE '' END;
