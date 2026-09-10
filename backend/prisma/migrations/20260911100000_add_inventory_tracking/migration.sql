ALTER TABLE "products" ADD COLUMN "stockQuantity" INTEGER;
ALTER TABLE "orders" ADD COLUMN "inventoryCommittedAt" TIMESTAMP(3);

ALTER TABLE "products"
ADD CONSTRAINT "products_stockQuantity_check" CHECK ("stockQuantity" IS NULL OR "stockQuantity" >= 0);
