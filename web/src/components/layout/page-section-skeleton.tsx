import { Badge, Card } from "@/components/ui";

export function PageSectionSkeleton({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <Badge variant="accent">Week 02 Core UI Shell</Badge>
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="max-w-3xl text-[var(--color-muted-fg)]">{description}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-xl font-semibold">Structural Section A</h2>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Foundation layout block for production content integration.
          </p>
        </Card>
        <Card>
          <h2 className="mb-2 text-xl font-semibold">Structural Section B</h2>
          <p className="text-sm text-[var(--color-muted-fg)]">
            Reusable section skeleton aligned to design system tokens.
          </p>
        </Card>
      </div>
    </section>
  );
}
