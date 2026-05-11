# Firestore Security Specification - PredictStock AI

## 1. Data Invariants
- A `Product` must have a unique SKU and positive stock levels.
- A `SaleRecord` must reference a valid `Product`.
- `Alerts` are system-generated or based on inventory thresholds.
- Only authenticated "Store Managers" (simulated by allowing signed-in users for this MVP) can read/write data.
- User data isolation is not strictly required if it's a single store app, but we will ensure that only authorized users can modify data.

## 2. The Dirty Dozen Payloads (Denial Tests)
1. **Identity Spoofing**: Attempt to create a product as an unauthenticated user.
2. **Negative Stock**: Attempt to set `currentStock` to -10.
3. **Ghost Field**: Adding `isSuperAdmin: true` to a product document.
4. **Invalid SKU**: Creating a product with a 2MB string as SKU.
5. **Orphaned Sale**: Creating a `SaleRecord` for a non-existent `productId`.
6. **Immutable Tampering**: Changing `createdAt` on an existing alert.
7. **Cross-User Pollution**: Read alerts if not owner (though we have no owner field yet, we should add it if multi-tenant).
8. **Malicious ID**: Creating a collection with ID `../../secrets`.
9. **Status Jumping**: Setting an alert status to 'resolved' without being authenticated.
10. **Resource Exhaustion**: Sending an array of 100,000 tags in a Product.
11. **Spoofed Email**: Accessing as `admin@store.com` but `email_verified` is false.
12. **Blanket Query**: Unauthenticated `list` of all sales.

## 3. Test Runner (Draft Plan)
- Verify that unauthenticated access is blocked.
- Verify that `isValidProduct` blocks invalid types and sizes.
- Verify that `isValidSale` checks product existence.
