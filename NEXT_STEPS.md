# Galla Website — Next Steps

1. [ ] **Add a card-payment provider.** Ask Galla's bank for an e-commerce merchant account and hosted gateway that accepts Visa and Mastercard. Obtain test credentials, documentation, fees, supported currencies, and production credentials.

2. [ ] **Build secure card checkout.** Add “Card” beside “Cash on delivery,” redirect card customers to the bank's hosted payment page, verify the bank callback on the backend, and set orders to `PAID`, `FAILED`, or `CANCELLED`. Never store card details.

3. [ ] **Calculate totals on the backend.** Read product prices from the database, calculate shipping and the final total on the server, and save those amounts with the order. Do not trust totals sent by the browser.

4. [ ] **Add order confirmation.** Show an order number after checkout and email the customer their items, total, delivery address, payment method, and order status.

5. [ ] **Add order management.** Create a protected admin view where Galla can see orders and update them to `CONFIRMED`, `SHIPPED`, `DELIVERED`, or `CANCELLED`.

6. [ ] **Define delivery rules.** Confirm delivery countries/areas, delivery price, free-shipping threshold, delivery time, accepted currency, and the cash-on-delivery process.

7. [ ] **Add required store pages.** Publish Privacy Policy, Terms and Conditions, Shipping Policy, Returns/Refund Policy, and company/legal details; link them in the footer and checkout.

8. [ ] **Finish production checks.** Test cash and card orders on mobile and desktop, add the missing favicon, fix the homepage address spacing (`Ilindenska 160, Tetovo`), verify all contact details, and remove the React Router warnings during the next dependency update.
