import { auth } from "@/lib/auth/auth";
import { AdminShellClient } from "@/components/layout/admin-shell-client";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role === "owner" ? "owner" : "editor";
  return (
    <AdminShellClient role={role} userName={session?.user?.name}>
      {children}
    </AdminShellClient>
  );
}
