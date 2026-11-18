/**
 * Currency utility for Kenyan Shillings (KES / KSh)
 */

export function formatKSh(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'KSh 0';
  }
  return `KSh ${Math.round(amount).toLocaleString('en-KE')}`;
}

export function formatKES(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'KES 0';
  }
  return `KES ${Math.round(amount).toLocaleString('en-KE')}`;
}
