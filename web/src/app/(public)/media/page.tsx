import type { Metadata } from "next";
import Link from "next/link";

import { RevealSection } from "@/components/motion/reveal-section";
import { Card } from "@/components/ui";
import {
  buildMediaListQuery,
  MEDIA_FORMAT_VALUES,
  parseMediaListQueryFromSearchParams,
} from "@/lib/media/filters";
import { getCachedPublicMediaAppearances } from "@/lib/media/queries";
import { isRevealEnabled } from "@/lib/motion/manifest";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Media | Triumph Kia Teh",
  description: "Media appearances, interviews, and publications featuring Triumph Kia Teh.",
  canonicalPath: "/media",
});

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const urlSearchParams = new URLSearchParams(flattenSearchParams(params));
  const parsed = parseMediaListQueryFromSearchParams(urlSearchParams);
  const filters = parsed.success ? parsed.data : {};
  const mediaPage = await getCachedPublicMediaAppearances(filters);
  const items = mediaPage?.rows ?? [];
  const nextCursor = mediaPage?.nextCursor ?? null;

  const availableYears = Array.from(
    new Set(
      items
        .map((item) => toDate(item.publishedAt)?.getUTCFullYear())
        .filter((value): value is number => typeof value === "number"),
    ),
  ).sort((a, b) => b - a);

  return (
    <section className="space-y-8">
      <RevealSection as="header" enabled={isRevealEnabled("media", "header")} className="space-y-3">
        <h1 className="text-4xl font-semibold">Media</h1>
        <p className="max-w-3xl text-[var(--color-muted-fg)]">
          Interviews, features, and public conversations documenting ideas in practice.
        </p>
      </RevealSection>

      <RevealSection
        as="nav"
        enabled={isRevealEnabled("media", "filters")}
        aria-label="Filter media appearances"
        className="flex flex-wrap gap-2 text-sm"
      >
        <Link href={routes.public.media} className="rounded-full border px-3 py-1 hover:bg-[var(--color-muted)]">
          All formats
        </Link>
        {MEDIA_FORMAT_VALUES.map((format) => (
          <Link
            key={format}
            href={`${routes.public.media}${buildMediaListQuery({ ...filters, format })}`}
            className="rounded-full border px-3 py-1 hover:bg-[var(--color-muted)]"
          >
            Format: {format.replaceAll("_", " ")}
          </Link>
        ))}
        {availableYears.map((year) => (
          <Link
            key={year}
            href={`${routes.public.media}${buildMediaListQuery({ ...filters, year })}`}
            className="rounded-full border px-3 py-1 hover:bg-[var(--color-muted)]"
          >
            Year: {year}
          </Link>
        ))}
      </RevealSection>

      <RevealSection
        as="ul"
        enabled={isRevealEnabled("media", "results")}
        className="grid gap-4"
        aria-label="Media appearances list"
      >
        {items.length === 0 ? (
          <li>
            <Card>
              <p className="text-sm text-[var(--color-muted-fg)]">
                No media appearances match the selected filters.
              </p>
            </Card>
          </li>
        ) : (
          items.map((item) => (
            <li key={item.id}>
              <Card className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-[var(--color-muted-fg)]">
                  {item.format}
                  {toDate(item.publishedAt) ? (
                    <>
                      {" "}
                      •{" "}
                      {toDate(item.publishedAt)?.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                      })}
                    </>
                  ) : null}
                </p>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-sm text-[var(--color-muted-fg)]">{item.outlet}</p>
                <p className="text-sm text-[var(--color-foreground)]">{item.summary}</p>
                {item.externalUrl ? (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm text-[var(--color-accent)] underline-offset-4 hover:underline"
                  >
                    Open source
                  </a>
                ) : null}
              </Card>
            </li>
          ))
        )}
      </RevealSection>
      {nextCursor ? (
        <div>
          <Link
            href={`${routes.public.media}${buildMediaListQuery(filters, { cursor: nextCursor })}`}
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-[var(--color-muted)]"
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
