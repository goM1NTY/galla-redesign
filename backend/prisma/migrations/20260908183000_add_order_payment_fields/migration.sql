-- Existing orders remain valid while all newly submitted cash orders require
-- delivery details at the API validation layer.
CREATE TYPE "PaymentMethod" AS ENUM ('CASH_ON_DELIVERY', 'CARD');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');

ALTER TABLE "orders"
ADD COLUMN "deliveryAddress" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "postalCode" TEXT,
ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH_ON_DELIVERY',
ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
