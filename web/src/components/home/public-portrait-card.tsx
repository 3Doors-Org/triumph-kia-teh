import { cn } from "@/lib/utils";

export function PublicPortraitCard({
  portraitUrl,
  initials,
  imageAlt,
  className,
}: {
  portraitUrl: string | null;
  initials: string;
  imageAlt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl border border-[var(--color-primary-fg)]/15 bg-gradient-to-b from-[color-mix(in_srgb,var(--color-primary-fg)_12%,transparent)] to-[color-mix(in_srgb,var(--color-primary-fg)_4%,transparent)] p-5 shadow-md md:p-6",
        className,
      )}
    >
      <div className="relative flex h-40 w-40 items-center justify-center md:h-44 md:w-44">
        {portraitUrl ? (
          <img
            src={portraitUrl}
            alt={imageAlt}
            className="h-full w-full rounded-full border-2 border-[var(--color-accent)]/40 object-cover shadow-inner"
            width={176}
            height={176}
          />
        ) : (
          <div
            role="img"
            aria-label={`${imageAlt} (placeholder)`}
            className="flex h-full w-full items-center justify-center rounded-full border-2 border-dashed border-[var(--color-primary-fg)]/25 bg-[var(--color-primary-fg)]/5"
          >
            <span className="font-[var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-accent)] md:text-5xl">
              {initials}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
