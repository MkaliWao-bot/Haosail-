# HaoSail Machinery Firestore Security Specification

## 1. Data Invariants
1. **Identity Binding & Email Verification**: Every `/users/{userId}`, `/users/{userId}/private/{docId}`, and `/users/{userId}/orders/{orderId}` document requires an authenticated Firebase Auth session with `request.auth.token.email_verified == true` (covering Google Sign-In and verified Email/Password accounts).
2. **PII Split Isolation**: Contact fields (`email`, `phone`, `kraPin`, `address`) reside strictly in `/users/{userId}/private/info`, isolated from `/users/{userId}` and readable/writable only by the verified owner (`isOwner(userId)`).
3. **RBAC Admin Isolation (No Self-Escalation)**: Admin privileges are verified exclusively via bootstrapped runtime admin email (`felitexcyber001@gmail.com` with `email_verified == true`) or an authorized document in `/admins/{uid}`. Regular users cannot add `role`/`isAdmin` fields to `/users/{uid}` or write `/admins/{uid}`.
4. **Master Gate Parent Existence**: Subcollections `/users/{userId}/private/{docId}` and `/users/{userId}/orders/{orderId}` verify that the parent `/users/{userId}` document exists before allowing sub-resource writes.
5. **Immutable Ownership & Timestamps**: `uid`, `userId`, `orderId`, and `createdAt` are immutable once created. `createdAt` and `updatedAt` must equal `request.time` on create/update respectively.
6. **Terminal State Lock & Admin Override**: Orders in `'completed'` status cannot be modified by standard users. Forward-only state transitions (`confirmed -> dispatched -> completed`) apply to owners/admins, with an explicit `|| isAdmin()` override for dispatch state corrections.
7. **Strict Field Allowlisting & Query Enforcer**: Every entity checks `keys().hasAll(...)` + `keys().hasOnly(...)` on create and `diff().affectedKeys().hasOnly(...)` on update; `allow list` never invokes `get()`/`exists()` and evaluates `resource.data`.

## 2. The "Dirty Dozen" Attack Payloads
1. **Cross-User Read/Write Spoof**: User A (`uid: "userA"`) attempts to read or create `/users/userB/private/info`. -> Expect `PERMISSION_DENIED`.
2. **Unverified Email/Password Bypass**: Newly registered user with `email_verified: false` attempts to write `/users/{uid}` or admin email with `email_verified: false`. -> Expect `PERMISSION_DENIED`.
3. **Ghost / Shadow Privilege Escalation Field**: Owner sends `{ uid, displayName, role: "admin", isAdmin: true, createdAt, updatedAt }` to `/users/{uid}`. -> Expect `PERMISSION_DENIED`.
4. **Admin Registry Self-Grant Attack**: Non-admin user writes `{ uid: attackerUid, email, grantedBy: attackerUid, createdAt }` to `/admins/{attackerUid}`. -> Expect `PERMISSION_DENIED`.
5. **Timestamp Forgery on Create**: Owner sends `createdAt: "2020-01-01T00:00:00Z"` instead of `request.time`. -> Expect `PERMISSION_DENIED`.
6. **Timestamp Mutation on Update**: Owner modifies `createdAt` during a profile update. -> Expect `PERMISSION_DENIED`.
7. **Document ID Poisoning**: Client writes `/users/{uid}/orders/${"x".repeat(500)}` with a non-matching or oversized ID (`>128` chars). -> Expect `PERMISSION_DENIED`.
8. **Field Overflow / Denial of Wallet String**: Client sets `workshopName` to a 5,000-character string (`> 120` max). -> Expect `PERMISSION_DENIED`.
9. **Orphan Order Without Parent User Doc**: Authenticated user attempts to create `/users/{uid}/orders/ORD-1001` before `/users/{uid}` exists. -> Expect `PERMISSION_DENIED`.
10. **Owner UID Reassignment on Update**: Owner attempts `update` on `/users/{uid}/orders/ORD-1001` changing `userId` to `"attacker"`. -> Expect `PERMISSION_DENIED`.
11. **Invalid Enum Status Injection**: Client creates order with `status: "free-override"` or `settlementMode: "zero-cost"`. -> Expect `PERMISSION_DENIED`.
12. **Terminal State Resurrection by Non-Admin**: Non-admin buyer attempts to revert an order whose `existing().status == 'completed'` back to `'confirmed'`. -> Expect `PERMISSION_DENIED`.
