-- NULL stock means unlimited packs; keep availability manageable in the admin panel.
UPDATE "products"
SET "stockQuantity" = NULL, "inStock" = TRUE, "updatedAt" = CURRENT_TIMESTAMP
WHERE "category" = 'capsules';
