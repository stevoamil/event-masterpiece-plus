import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminShell from "@/components/admin/admin-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell user={{ name: session.name, email: session.email, role: session.role }}>
      {children}
    </AdminShell>
  );
}
