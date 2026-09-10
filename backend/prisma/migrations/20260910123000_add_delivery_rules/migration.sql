ALTER TABLE "orders"
ADD COLUMN "deliveryCountry" TEXT NOT NULL DEFAULT 'North Macedonia',
ADD COLUMN "eurToMkdRate" DOUBLE PRECISION;
