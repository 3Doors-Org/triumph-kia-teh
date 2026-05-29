import { unstable_cache } from "next/cache";

import { CONTENT_TAGS } from "@/lib/cache/revalidate-content";
import { getPublicTestimonials } from "@/lib/testimonials/queries";

export const getCachedPublicTestimonials = unstable_cache(
  async () => getPublicTestimonials({ limit: 50 }),
  ["public-testimonials"],
  { tags: [CONTENT_TAGS.testimonials], revalidate: 300 },
);
