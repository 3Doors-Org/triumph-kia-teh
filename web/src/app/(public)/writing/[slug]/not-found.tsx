import Link from "next/link";

import { Card } from "@/components/ui";
import { routes } from "@/lib/routes";

export default function WritingPostNotFound() {
  return (
    <section className="mx-auto max-w-3xl py-8">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Writing post not found</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          The post may be unpublished, still a draft, or the URL may be incorrect.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link className="underline hover:no-underline" href={routes.public.writing}>
            Back to Writing index
          </Link>
          <Link className="underline hover:no-underline" href={routes.public.home}>
            Return Home
          </Link>
        </div>
      </Card>
    </section>
  );
}
