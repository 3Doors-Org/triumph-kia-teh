import type { Session } from "next-auth";

import { auth } from "@/lib/auth/auth";

export class RoleAccessError extends Error {
  status: 401 | 403;

  constructor(status: 401 | 403, message: string) {
    super(message);
    this.status = status;
  }
}

export function requireRoleFromSession(
  session: Session | null,
  allowedRoles: Array<"owner" | "editor">,
): Session {
  if (!session?.user) {
    throw new RoleAccessError(401, "Unauthorized");
  }

  const role = session.user.role;
  if (!allowedRoles.includes(role as "owner" | "editor")) {
    throw new RoleAccessError(403, "Forbidden");
  }

  return session;
}

export async function requireRole(allowedRoles: Array<"owner" | "editor">): Promise<Session> {
  const session = await auth();
  return requireRoleFromSession(session, allowedRoles);
}

