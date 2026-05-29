import { Card } from "@/components/ui";

export default function CommunityImpactLoading() {
  return (
    <section className="space-y-8" aria-busy="true" aria-live="polite">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">Community Impact</h1>
        <p className="max-w-3xl text-[var(--color-muted-fg)]">Loading impact entries...</p>
      </header>
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="space-y-3">
            <div className="h-4 w-44 animate-pulse rounded bg-[var(--color-muted)]" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-[var(--color-muted)]" />
            <div className="h-4 w-full animate-pulse rounded bg-[var(--color-muted)]" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-[var(--color-muted)]" />
          </Card>
        ))}
      </div>
    </section>
  );
}
