// Payload-first verification suite for HaoSail Firestore security invariants.
// Validates the Dirty Dozen attack vectors against blueprint constraints prior to deployment.

export interface DirtyDozenCase {
  id: number;
  name: string;
  targetPath: string;
  operation: 'create' | 'update' | 'get' | 'list';
  uid: string;
  emailVerified: boolean;
  payload: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_PAYLOADS: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Cross-User PII Read/Write Spoof',
    targetPath: '/users/victim_uid/private/info',
    operation: 'create',
    uid: 'attacker_uid',
    emailVerified: true,
    payload: { uid: 'victim_uid', email: 'victim@example.com' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified Email/Password Bypass',
    targetPath: '/users/unverified_uid',
    operation: 'create',
    uid: 'unverified_uid',
    emailVerified: false,
    payload: { uid: 'unverified_uid', displayName: 'Test Buyer' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow Privilege Escalation Field (isAdmin/role)',
    targetPath: '/users/buyer_uid',
    operation: 'create',
    uid: 'buyer_uid',
    emailVerified: true,
    payload: { uid: 'buyer_uid', displayName: 'Buyer', isAdmin: true, role: 'superadmin' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Self-Assigned Admin Record Creation',
    targetPath: '/admins/attacker_uid',
    operation: 'create',
    uid: 'attacker_uid',
    emailVerified: true,
    payload: { uid: 'attacker_uid', email: 'attacker@example.com', grantedBy: 'attacker_uid' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Forged Past Timestamp on Create',
    targetPath: '/users/buyer_uid',
    operation: 'create',
    uid: 'buyer_uid',
    emailVerified: true,
    payload: { uid: 'buyer_uid', displayName: 'Buyer', createdAt: '1999-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Immortal createdAt Mutation on Update',
    targetPath: '/users/buyer_uid',
    operation: 'update',
    uid: 'buyer_uid',
    emailVerified: true,
    payload: { createdAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Oversized / Malformed Order ID Poisoning',
    targetPath: `/users/buyer_uid/orders/${'A'.repeat(250)}`,
    operation: 'create',
    uid: 'buyer_uid',
    emailVerified: true,
    payload: { orderId: 'A'.repeat(250), userId: 'buyer_uid' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Workshop Name String Overflow (> 120 chars)',
    targetPath: '/users/buyer_uid',
    operation: 'update',
    uid: 'buyer_uid',
    emailVerified: true,
    payload: { workshopName: 'W'.repeat(500) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Orphan Order Write Without Parent Account',
    targetPath: '/users/orphan_uid/orders/ORD-9999',
    operation: 'create',
    uid: 'orphan_uid',
    emailVerified: true,
    payload: { orderId: 'ORD-9999', userId: 'orphan_uid', status: 'confirmed' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Owner UID Reassignment on Existing Order',
    targetPath: '/users/buyer_uid/orders/ORD-1001',
    operation: 'update',
    uid: 'buyer_uid',
    emailVerified: true,
    payload: { userId: 'other_uid' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Invalid Enum Order Status Injection',
    targetPath: '/users/buyer_uid/orders/ORD-1002',
    operation: 'create',
    uid: 'buyer_uid',
    emailVerified: true,
    payload: { orderId: 'ORD-1002', userId: 'buyer_uid', status: 'bypassed-paid' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Terminal State Modification by Non-Admin',
    targetPath: '/users/buyer_uid/orders/ORD-1004',
    operation: 'update',
    uid: 'buyer_uid',
    emailVerified: true,
    payload: { status: 'confirmed' },
    expectedResult: 'PERMISSION_DENIED',
  },
];
