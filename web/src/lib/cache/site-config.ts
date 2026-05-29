import { revalidateTag } from "next/cache";

export const SITE_CONFIG_TAGS = {
  navigation: "site:navigation",
  exitIntent: "site:exit-intent",
} as const;

export function revalidateSiteConfig(tag: (typeof SITE_CONFIG_TAGS)[keyof typeof SITE_CONFIG_TAGS]) {
  revalidateTag(tag, "max");
}
