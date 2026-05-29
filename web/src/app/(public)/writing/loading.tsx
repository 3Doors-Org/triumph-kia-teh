import { Card } from "@/components/ui";

export default function WritingLoading() {
  return (
    <section className="space-y-8" aria-busy="true" aria-live="polite">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">Writing</h1>
        <p className="max-w-3xl text-[var(--color-muted-fg)]">Loading essays and long-form pieces...</p>
      </header>
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded bg-[var(--color-muted)]" />
            <div className="h-7 w-4/5 animate-pulse rounded bg-[var(--color-muted)]" />
            <div className="h-4 w-full animate-pulse rounded bg-[var(--color-muted)]" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--color-muted)]" />
          </Card>
        ))}
      </div>
    </section>
  );
}
