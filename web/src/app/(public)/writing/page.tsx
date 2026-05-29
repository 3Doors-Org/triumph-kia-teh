import type { Metadata } from "next";
import Link from "next/link";

import { RevealSection } from "@/components/motion/reveal-section";
import { Button, Card, Input } from "@/components/ui";
import { isRevealEnabled } from "@/lib/motion/manifest";
import {
  buildWritingListQuery,
  parseWritingCursorFromSearchParams,
  parseWritingListFiltersForPage,
  WRITING_PUBLIC_PAGE_SIZE,
} from "@/lib/writing/filters";
import { getCachedWritingFilterOptions, getCachedWritingPostsPage } from "@/lib/writing/queries";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Writing | Triumph Kia Teh",
  description: "Essays and long-form writing by Triumph Kia Teh.",
  canonicalPath: "/writing",
});

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseWritingListFiltersForPage(new URLSearchParams(flattenSearchParams(params)));
  const cursor = parseWritingCursorFromSearchParams(new URLSearchParams(flattenSearchParams(params)));

  const [{ rows, nextCursor }, options] = await Promise.all([
    getCachedWritingPostsPage(filters, cursor, WRITING_PUBLIC_PAGE_SIZE),
    getCachedWritingFilterOptions(),
  ]);

  return (
    <section className="space-y-8">
      <RevealSection as="header" enabled={isRevealEnabled("writing", "header")} className="space-y-3">
        <h1 className="text-4xl font-semibold">Writing</h1>
        <p className="max-w-3xl text-[var(--color-muted-fg)]">
          Long-form essays mapped to the Three Doors framework: access, excellence, and opportunity.
        </p>
      </RevealSection>

      <RevealSection
        as="form"
        enabled={false}
        action={routes.public.writing}
        method="get"
        className="flex max-w-2xl flex-col gap-2 sm:flex-row sm:items-end"
      >
        {filters.door ? <input type="hidden" name="door" value={filters.door} /> : null}
        {filters.tag ? <input type="hidden" name="tag" value={filters.tag} /> : null}
        <div className="flex-1 space-y-1">
          <label htmlFor="writing-search" className="block text-sm font-medium text-[var(--color-foreground)]">
            Search titles and summaries
          </label>
          <Input
            id="writing-search"
            name="search"
            type="search"
            maxLength={200}
            defaultValue={filters.search ?? ""}
            className="text-base"
            placeholder="Keywords"
            autoComplete="off"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
        {filters.search ? (
          <Link
            href={buildWritingListQuery({ door: filters.door, tag: filters.tag })}
            className="inline-flex h-11 items-center justify-center px-3 text-sm text-[var(--color-accent)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Clear search
          </Link>
        ) : null}
      </RevealSection>

      <nav aria-label="Filter writing by door" className="flex flex-wrap gap-2 text-sm">
        <Link
          href={buildWritingListQuery({ tag: filters.tag, search: filters.search })}
          className="rounded-full border border-[var(--color-primary)]/20 px-3 py-1 hover:bg-[var(--color-muted)]"
        >
          All doors
        </Link>
        {options.doors.map((door) => (
          <Link
            key={door}
            href={buildWritingListQuery({ door, tag: filters.tag, search: filters.search })}
            className="rounded-full border border-[var(--color-primary)]/20 px-3 py-1 hover:bg-[var(--color-muted)]"
          >
            Door: {door}
          </Link>
        ))}
      </nav>

      {options.tags.length > 0 ? (
        <nav aria-label="Filter writing by tag" className="flex flex-wrap gap-2 text-sm">
          <Link
            href={buildWritingListQuery({ door: filters.door, search: filters.search })}
            className="rounded-full border border-[var(--color-primary)]/20 px-3 py-1 hover:bg-[var(--color-muted)]"
          >
            All tags
          </Link>
          {options.tags.map((tag) => (
            <Link
              key={tag}
              href={buildWritingListQuery({ door: filters.door, tag, search: filters.search })}
              className="rounded-full border border-[var(--color-primary)]/20 px-3 py-1 hover:bg-[var(--color-muted)]"
            >
              Tag: {tag}
            </Link>
          ))}
        </nav>
      ) : null}

      <RevealSection
        as="ul"
        enabled={isRevealEnabled("writing", "results")}
        className="grid gap-4"
        aria-label="Writing results"
      >
        {rows.length === 0 ? (
          <li>
            <Card>
            <p className="text-sm text-[var(--color-muted-fg)]">
              No published essays match your filters yet. Try clearing filters or widening your search.
            </p>
            </Card>
          </li>
        ) : (
          rows.map((row) => {
            const publishedAt = toDate(row.publishedAt);
            return (
              <li key={row.id}>
                <Card className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted-fg)]">
                    {publishedAt ? (
                      <time dateTime={publishedAt.toISOString()}>
                        {publishedAt.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    ) : null}
                    {row.door ? (
                      <>
                        {publishedAt ? <span aria-hidden="true">•</span> : null}
                        <span>{row.door}</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className="text-xl font-semibold">
                    <Link
                      href={routes.public.writingBySlug(row.slug)}
                      className="text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                    >
                      {row.title}
                    </Link>
                  </h2>
                  {row.excerpt ? <p className="text-sm text-[var(--color-muted-fg)]">{row.excerpt}</p> : null}
                  {row.tags.length > 0 ? (
                    <p className="text-xs text-[var(--color-muted-fg)]">Tags: {row.tags.join(", ")}</p>
                  ) : null}
                </Card>
              </li>
            );
          })
        )}
      </RevealSection>

      {nextCursor ? (
        <div>
          <Link
            href={buildWritingListQuery(filters, { cursor: nextCursor })}
            className="inline-flex items-center rounded-md border border-[var(--color-primary)]/20 px-4 py-2 text-sm hover:bg-[var(--color-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Load more
          </Link>
        </div>
      ) : null}
    </section>
  );
}

function flattenSearchParams(params: Record<string, string | string[] | undefined>): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      flat[key] = value;
    } else if (Array.isArray(value) && typeof value[0] === "string") {
      flat[key] = value[0];
    }
  }
  return flat;
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
