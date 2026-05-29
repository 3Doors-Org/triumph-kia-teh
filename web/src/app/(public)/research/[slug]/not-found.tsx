import Link from "next/link";

import { Card } from "@/components/ui";
import { routes } from "@/lib/routes";

export default function ResearchNotFound() {
  return (
    <section className="mx-auto max-w-3xl py-8">
      <Card className="space-y-3">
        <h1 className="text-2xl font-semibold">Research item not found</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          The item may be unpublished or the identifier in the URL is invalid.
        </p>
        <Link className="underline hover:no-underline" href={routes.public.research}>
          Return to research index
        </Link>
      </Card>
    </section>
  );
}
