import { Card } from "@/components/ui";

export function AdminPageSkeleton({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-fg)]">{description}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Management Panel</h2>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Audit-Ready Activity Panel</h2>
        </Card>
      </div>
    </section>
  );
}
