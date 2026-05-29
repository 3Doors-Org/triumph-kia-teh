import { z } from "zod";

import { inquiryTypeValues } from "@/lib/schemas/contact";

export const LEAD_STATUS_VALUES = ["new", "read", "replied", "archived"] as const;

export type LeadStatus = (typeof LEAD_STATUS_VALUES)[number];

export const leadStatusSchema = z.enum(LEAD_STATUS_VALUES);

export const leadInquiryTypeSchema = z.enum(inquiryTypeValues);

export { inquiryTypeValues as leadInquiryTypeValues } from "@/lib/schemas/contact";
