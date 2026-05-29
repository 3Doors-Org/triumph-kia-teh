import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "test" ? "silent" : "info"),
  base: undefined,
  redact: {
    paths: [
      "email",
      "message",
      "turnstileToken",
      "name",
      "ip",
      "userAgent",
      "headers.authorization",
      "headers.cookie",
    ],
    remove: true,
  },
});

export type ContactAuditEvent =
  | "lead_created"
  | "lead_rejected_honeypot"
  | "lead_rate_limited"
  | "turnstile_failed"
  | "validation_failed";

type ContactAuditPayload = {
  event: ContactAuditEvent;
  sourcePage?: string;
  inquiryType?: string;
  leadId?: string;
  reason?: string;
  retryAfter?: number;
};

export function logContactAudit(payload: ContactAuditPayload) {
  logger.info(
    {
      domain: "contact",
      ...payload,
    },
    payload.event,
  );
}

export function logServerError(message: string, details?: Record<string, unknown>) {
  logger.error({ ...details }, message);
}

type ContentRevalidationPayload = {
  event: "revalidate_executed" | "revalidate_coalesced";
  target:
    | "writing"
    | "research"
    | "communityImpact"
    | "achievements"
    | "mediaAppearances"
    | "aboutPage"
    | "testimonials"
    | "organizations";
  slug?: string;
  coalescedWindowMs?: number;
};

export function logContentRevalidation(payload: ContentRevalidationPayload) {
  logger.info(
    {
      domain: "revalidation",
      ...payload,
    },
    payload.event,
  );
}

type WritingAuditPayload = {
  event: "writing_created" | "writing_updated" | "writing_published" | "writing_unpublished";
  postId: string;
  slug: string;
  actorUserId: string;
};

export function logWritingAudit(payload: WritingAuditPayload) {
  logger.info(
    {
      domain: "writing",
      ...payload,
    },
    payload.event,
  );
}

type ResearchAuditPayload = {
  event: "research_created" | "research_updated" | "research_published" | "research_unpublished";
  researchId: string;
  slug: string;
  actorUserId: string;
};

export function logResearchAudit(payload: ResearchAuditPayload) {
  logger.info(
    {
      domain: "research",
      ...payload,
    },
    payload.event,
  );
}

type CommunityImpactAuditPayload = {
  event: "impact_created" | "impact_updated" | "impact_deleted";
  impactId: string;
  actorUserId: string;
};

export function logCommunityImpactAudit(payload: CommunityImpactAuditPayload) {
  logger.info(
    {
      domain: "community-impact",
      ...payload,
    },
    payload.event,
  );
}

type AchievementAuditPayload = {
  event: "achievement_created" | "achievement_updated" | "achievement_deleted";
  achievementId: string;
  actorUserId: string;
};

export function logAchievementAudit(payload: AchievementAuditPayload) {
  logger.info(
    {
      domain: "achievements",
      ...payload,
    },
    payload.event,
  );
}

type MediaAuditPayload = {
  event: "media_created" | "media_updated" | "media_deleted";
  mediaId: string;
  actorUserId: string;
};

export function logMediaAudit(payload: MediaAuditPayload) {
  logger.info(
    {
      domain: "media",
      ...payload,
    },
    payload.event,
  );
}

type TestimonialAuditPayload = {
  event: "testimonial_created" | "testimonial_updated" | "testimonial_deleted";
  testimonialId: string;
  actorUserId: string;
};

export function logTestimonialAudit(payload: TestimonialAuditPayload) {
  logger.info(
    {
      domain: "testimonials",
      ...payload,
    },
    payload.event,
  );
}

type AssetAuditPayload = {
  event: "asset_upload_initiated" | "asset_upload_confirmed" | "asset_deleted";
  assetId: string;
  actorUserId: string;
};

export function logAssetAudit(payload: AssetAuditPayload) {
  logger.info(
    {
      domain: "assets",
      ...payload,
    },
    payload.event,
  );
}

type LeadAuditPayload = {
  event: "lead_updated";
  leadId: string;
  actorUserId: string;
};

export function logLeadAudit(payload: LeadAuditPayload) {
  logger.info(
    {
      domain: "leads",
      ...payload,
    },
    payload.event,
  );
}

type NavigationAuditPayload = {
  event: "navigation_updated";
  actorUserId: string;
};

export function logNavigationAudit(payload: NavigationAuditPayload) {
  logger.info(
    {
      domain: "navigation",
      ...payload,
    },
    payload.event,
  );
}

type ExitIntentAuditPayload = {
  event: "exit_intent_updated";
  actorUserId: string;
};

export function logExitIntentAudit(payload: ExitIntentAuditPayload) {
  logger.info(
    {
      domain: "exit-intent",
      ...payload,
    },
    payload.event,
  );
}

type OrgMetricAuditPayload = {
  event: "org_metric_created" | "org_metric_updated";
  metricId: string;
  actorUserId: string;
};

export function logOrgMetricAudit(payload: OrgMetricAuditPayload) {
  logger.info(
    {
      domain: "org-metrics",
      ...payload,
    },
    payload.event,
  );
}

type AuthAuditPayload = {
  event:
    | "auth_login_succeeded"
    | "auth_login_failed"
    | "auth_login_rate_limited"
    | "auth_login_validation_failed";
  email?: string;
  reason?: string;
  retryAfter?: number;
};

export function logAuthAudit(payload: AuthAuditPayload) {
  logger.info(
    {
      domain: "auth",
      ...payload,
    },
    payload.event,
  );
}
