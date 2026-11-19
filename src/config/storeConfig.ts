// Centralized storefront business & banking configuration.
// Live overrides can be supplied via VITE_HAOSAIL_* environment variables without code changes.

export const STORE_CONFIG = {
  brandName: 'HaoSail Industrial Kenya',
  domain: import.meta.env.VITE_HAOSAIL_DOMAIN || 'haosail.ke',
  whatsappNumber: import.meta.env.VITE_HAOSAIL_WHATSAPP || '254700000000',
  salesPhoneDisplay: import.meta.env.VITE_HAOSAIL_PHONE || '+254 700 000 000',
  salesPhoneHref: `tel:+${import.meta.env.VITE_HAOSAIL_WHATSAPP || '254700000000'}`,
  salesEmail: import.meta.env.VITE_HAOSAIL_EMAIL || 'sales@haosail.ke',
  yardAddress:
    import.meta.env.VITE_HAOSAIL_ADDRESS ||
    'HaoSail Commercial Distribution Center, Industrial Area, Nairobi, Kenya',
  paybill: import.meta.env.VITE_HAOSAIL_PAYBILL || '408282',
  bankName: import.meta.env.VITE_HAOSAIL_BANK_NAME || 'KCB Bank Kenya Ltd',
  bankBranch: import.meta.env.VITE_HAOSAIL_BANK_BRANCH || 'Industrial Area, Commercial Street',
  bankAccount: import.meta.env.VITE_HAOSAIL_BANK_ACCOUNT || '1298 4400 9123',
  companyKraPin: import.meta.env.VITE_HAOSAIL_KRA_PIN || 'P051234567K',
};
