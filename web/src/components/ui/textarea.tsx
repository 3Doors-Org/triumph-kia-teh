import * as React from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-[var(--color-muted)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-card-fg)] placeholder:text-[var(--color-muted-fg)]",
        className,
      )}
      {...props}
    />
  );
}
