// Auth pages layout - just passes through children
// Navbar hiding is handled by the Navbar component itself via usePathname()
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
