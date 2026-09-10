-- Amounts use integer cents to avoid floating-point rounding errors.
-- Price snapshots on items preserve the price charged at order time.
ALTER TABLE "orders"
ADD COLUMN "subtotalCents" INTEGER,
ADD COLUMN "shippingCents" INTEGER,
ADD COLUMN "totalCents" INTEGER,
ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'EUR';

ALTER TABLE "order_items"
ADD COLUMN "unitPriceCents" INTEGER,
ADD COLUMN "lineTotalCents" INTEGER;
