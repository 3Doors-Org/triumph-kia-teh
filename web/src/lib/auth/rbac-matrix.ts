export type AdminRole = "owner" | "editor";

export type RbacCapability =
  | "writing.update"
  | "writing.delete"
  | "research.update"
  | "research.delete"
  | "communityImpact.update"
  | "communityImpact.delete"
  | "achievements.update"
  | "achievements.delete"
  | "media.update"
  | "media.delete"
  | "testimonials.update"
  | "testimonials.delete"
  | "assets.upload"
  | "assets.confirm"
  | "assets.list"
  | "assets.delete";

const OWNER_CAPABILITIES: ReadonlySet<RbacCapability> = new Set<RbacCapability>([
  "writing.update",
  "writing.delete",
  "research.update",
  "research.delete",
  "communityImpact.update",
  "communityImpact.delete",
  "achievements.update",
  "achievements.delete",
  "media.update",
  "media.delete",
  "testimonials.update",
  "testimonials.delete",
  "assets.upload",
  "assets.confirm",
  "assets.list",
  "assets.delete",
]);

const EDITOR_CAPABILITIES: ReadonlySet<RbacCapability> = new Set<RbacCapability>([
  "writing.update",
  "research.update",
  "communityImpact.update",
  "achievements.update",
  "media.update",
  "testimonials.update",
  "assets.upload",
  "assets.confirm",
  "assets.list",
]);

export function canRolePerform(role: AdminRole, capability: RbacCapability): boolean {
  return role === "owner"
    ? OWNER_CAPABILITIES.has(capability)
    : EDITOR_CAPABILITIES.has(capability);
}
