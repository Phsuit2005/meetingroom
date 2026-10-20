import admins from '../config/admins.json';
export const ADMIN_EMAILS = admins;
export function isAdminEmail(email) { return ADMIN_EMAILS.includes(String(email || '').toLowerCase()); }
export function hasAdminAccess(user) { return Boolean(user?.emailVerified && isAdminEmail(user.email)); }
