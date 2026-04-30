import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-[var(--color-muted)] bg-[var(--color-card)] px-3 text-sm text-[var(--color-card-fg)] placeholder:text-[var(--color-muted-fg)]",
        className,
      )}
      {...props}
    />
  );
}
