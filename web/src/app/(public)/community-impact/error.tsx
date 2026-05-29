"use client";

import { useEffect } from "react";

import { Button, Card } from "@/components/ui";

export default function CommunityImpactError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold">Community Impact</h1>
      </header>
      <Card className="space-y-3">
        <p className="text-sm text-[var(--color-muted-fg)]">
          We could not load community impact entries right now.
        </p>
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </Card>
    </section>
  );
}
