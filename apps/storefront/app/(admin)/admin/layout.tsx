import AdminThemeGuard from "@/components/admin/AdminThemeGuard";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminThemeGuard />
      {children}
    </>
  );
}
