-- Start each capsule product with 20 complete packs, as requested.
UPDATE "products"
SET "stockQuantity" = 20, "inStock" = TRUE, "updatedAt" = CURRENT_TIMESTAMP
WHERE "category" = 'capsules';
