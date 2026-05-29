import { ProfilePortraitForm } from "@/components/admin/profile-portrait-form";
import { Card } from "@/components/ui";
import { auth } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/require-role";
import { getSiteProfile } from "@/lib/site-profile/queries";

export default async function AdminProfilePortraitPage() {
  await requireRole(["owner", "editor"]);
  const session = await auth();
  const displayName = session?.user?.name?.trim() || "Triumph Kia Teh";
  const profile = await getSiteProfile();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Profile portrait</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Control the portrait card on the public home page. Uploads use the same secure asset pipeline as the media
          library.
        </p>
      </header>

      <Card className="p-6">
        <ProfilePortraitForm initialPortraitUrl={profile?.portraitPublicUrl ?? null} ownerDisplayName={displayName} />
      </Card>
    </section>
  );
}
