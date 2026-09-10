# Galla Website — Next Steps

1. [ ] **Add a card-payment provider.** Ask Galla's bank for an e-commerce merchant account and hosted gateway that accepts Visa and Mastercard. Obtain test credentials, documentation, fees, supported currencies, and production credentials.

2. [ ] **Build secure card checkout.** Add “Card” beside “Cash on delivery,” redirect card customers to the bank's hosted payment page, verify the bank callback on the backend, and set orders to `PAID`, `FAILED`, or `CANCELLED`. Never store card details.

3. [x] **Calculate totals on the backend.** Product prices now come from the database; the backend calculates shipping and saves immutable unit prices, line totals, subtotal, shipping, final total, and currency with each order.

4. [x] **Add order confirmation.** Checkout now shows a persistent order number and total, and the customer receives an email with their items, total, delivery address, payment method, and order status.

5. [x] **Add order management.** A simple admin-key-protected view lists recent orders and updates them through `NEW`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, or `CANCELLED`. The same API can later connect to GC Core.

6. [x] **Define delivery rules.** Deliver across North Macedonia in 3–5 business days; delivery is 120 MKD and free above 2,150 MKD. Show EUR and MKD prices, with cash collected in MKD by the courier.

7. [x] **Add required store pages.** Privacy, Terms, Shipping, Returns/Refunds and Company Details pages are published and linked from the footer and checkout. Registered company and tax details still require business confirmation.

8. [ ] **Finish production checks.** Test cash and card orders on mobile and desktop, add the missing favicon, fix the homepage address spacing (`Ilindenska 160, Tetovo`), verify all contact details, and remove the React Router warnings during the next dependency update.
