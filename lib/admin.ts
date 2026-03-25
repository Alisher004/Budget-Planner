// Define admin emails here
const ADMIN_EMAILS = [
  'admin@example.com', // Replace with your actual admin email
  // Add more admin emails as needed
];

export function isAdmin(email: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
