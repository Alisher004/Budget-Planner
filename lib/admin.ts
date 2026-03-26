// Define admin email here
const ADMIN_EMAIL = 'alma@gmail.com';

export function isAdmin(email: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
