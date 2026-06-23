export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-admin-theme className="contents">{children}</div>;
}
