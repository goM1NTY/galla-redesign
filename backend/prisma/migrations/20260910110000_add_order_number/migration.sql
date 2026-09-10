-- Existing orders have no public order number; every new order receives one.
ALTER TABLE "orders" ADD COLUMN "orderNumber" TEXT;
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");
