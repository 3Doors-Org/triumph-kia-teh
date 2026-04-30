import * as React from "react";

import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-md border border-[var(--color-muted)] bg-[var(--color-card)] px-3 text-sm text-[var(--color-card-fg)]",
        className,
      )}
      {...props}
    />
  );
}
