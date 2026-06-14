"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button, Input, Select, Textarea } from "@/components/ui";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackAnalyticsEvent } from "@/lib/analytics/plausible-events";
import {
  contactSchema,
  contactSubjectSelectOptions,
  inquiryTypeValues,
  type ContactInput,
  type InquiryType,
} from "@/lib/schemas/contact";

type ContactFormValues = z.input<typeof contactSchema>;
const CONTACT_EVENT_SESSION_KEY = "analytics:contact_form_submitted";

export function ContactForm({
  inquiryType,
  e2eTurnstileBypass = false,
}: {
  inquiryType?: string;
  e2eTurnstileBypass?: boolean;
}) {
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);
  const [turnstileLoadError, setTurnstileLoadError] = useState(false);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
  const hasValidTurnstileSiteKey =
    turnstileSiteKey.length > 0 &&
    turnstileSiteKey !== "change_me" &&
    turnstileSiteKey.startsWith("0x");
  const bypassTurnstileByEnv =
    e2eTurnstileBypass || process.env.NEXT_PUBLIC_E2E_BYPASS_TURNSTILE === "true";
  const bypassTurnstile =
    bypassTurnstileByEnv ||
    (!hasValidTurnstileSiteKey && process.env.NODE_ENV !== "production");
  const turnstileRequired = !bypassTurnstile;
  const turnstileUnavailable =
    turnstileRequired && (!hasValidTurnstileSiteKey || turnstileLoadError);

  const defaultInquiryType = useMemo((): InquiryType | "" => {
    if (inquiryType && inquiryTypeValues.includes(inquiryType as InquiryType)) {
      return inquiryType as InquiryType;
    }
    return "";
  }, [inquiryType]);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      inquiryType: defaultInquiryType,
      message: "",
      website: "",
      turnstileToken: bypassTurnstile ? "e2e-test-token" : "",
      sourcePage: "/contact",
    },
  });

  const messageLength = useWatch({ control: form.control, name: "message" })?.length ?? 0;
  const turnstileToken = useWatch({ control: form.control, name: "turnstileToken" });
  const errorMessages = Object.values(form.formState.errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message));

  async function onSubmit(values: ContactFormValues) {
    setSubmitState("idle");
    setSubmitErrorMessage(null);

    if (turnstileUnavailable) {
      setSubmitState("error");
      setSubmitErrorMessage(
        "The security check is unavailable right now. Please email kiattriumph@gmail.com directly.",
      );
      return;
    }

    const payload: ContactInput = {
      ...values,
      inquiryType: values.inquiryType as ContactInput["inquiryType"],
      website: values.website ?? "",
      sourcePage: values.sourcePage ?? "/contact",
    };
    const response = await fetch("/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let message = "Submission failed. Please verify your details and try again.";
      try {
        const errorBody = (await response.json()) as { error?: string; retryAfter?: number };
        if (response.status === 429 && typeof errorBody.retryAfter === "number") {
          message = `Too many submissions. Please wait ${errorBody.retryAfter} seconds and try again.`;
        } else if (errorBody.error === "CAPTCHA verification failed") {
          message = "Security check failed. Please complete the verification and try again.";
          form.setValue("turnstileToken", "", { shouldValidate: true });
          setTurnstileLoadError(false);
        } else if (errorBody.error === "Validation failed") {
          message = "Please review the highlighted fields and try again.";
        } else if (errorBody.error) {
          message = errorBody.error;
        }
      } catch {
        /* keep default message */
      }
      setSubmitErrorMessage(message);
      setSubmitState("error");
      return;
    }

    if (typeof window !== "undefined" && !window.sessionStorage.getItem(CONTACT_EVENT_SESSION_KEY)) {
      window.sessionStorage.setItem(CONTACT_EVENT_SESSION_KEY, "1");
      trackAnalyticsEvent(ANALYTICS_EVENTS.contactFormSubmitted, {
        inquiry_type: payload.inquiryType,
      });
    }

    setSubmitState("success");
    form.reset({
      ...form.getValues(),
      name: "",
      email: "",
      message: "",
      website: "",
      turnstileToken: bypassTurnstile ? "e2e-test-token" : "",
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
      data-clarity-mask="true"
      data-lpignore="true"
      data-1p-ignore="true"
      suppressHydrationWarning
    >
      {errorMessages.length > 0 ? (
        <div role="alert" className="rounded-md border border-[var(--color-destructive)]/30 p-3 text-sm">
          <p className="font-medium text-[var(--color-destructive)]">
            Please review these fields before sending your message:
          </p>
          <ul className="mt-2 list-disc pl-5 text-[var(--color-destructive)]">
            {errorMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]" htmlFor="name">
          Full name <span className="text-[var(--color-accent)]" aria-hidden="true">*</span>
        </label>
        <Input id="name" placeholder="Joe Doe" {...form.register("name")} />
        <p className="mt-1 text-xs text-[var(--color-destructive)]">{form.formState.errors.name?.message}</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]" htmlFor="email">
          Email address <span className="text-[var(--color-accent)]" aria-hidden="true">*</span>
        </label>
        <Input id="email" type="email" placeholder="joe.doe@example.com" {...form.register("email")} />
        <p className="mt-1 text-xs text-[var(--color-destructive)]">{form.formState.errors.email?.message}</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]" htmlFor="subject">
          Subject
        </label>
        <Select id="subject" {...form.register("inquiryType")}>
          <option value="" disabled>
            Select inquiry type
          </option>
          {contactSubjectSelectOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <p className="mt-1 text-xs text-[var(--color-destructive)]">
          {form.formState.errors.inquiryType?.message}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--color-foreground)]" htmlFor="message">
          Message <span className="text-[var(--color-accent)]" aria-hidden="true">*</span>
        </label>
        <Textarea
          id="message"
          rows={8}
          placeholder="Please share the purpose, timeline, and key details of your request."
          {...form.register("message")}
        />
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-[var(--color-destructive)]">{form.formState.errors.message?.message}</p>
          <p className="text-xs text-[var(--color-muted-fg)]">{messageLength}/3000 characters</p>
        </div>
        <p className="mt-1 text-xs text-[var(--color-muted-fg)]">
          Maximum 3000 characters (roughly 450-600 words).
        </p>
      </div>

      <div className="absolute h-0 w-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
        <Input tabIndex={-1} autoComplete="off" {...form.register("website")} />
      </div>

      {turnstileRequired ? (
        hasValidTurnstileSiteKey ? (
          <Turnstile
            siteKey={turnstileSiteKey}
            onSuccess={(token) => {
              setTurnstileLoadError(false);
              form.setValue("turnstileToken", token, { shouldValidate: true });
            }}
            onError={() => {
              setTurnstileLoadError(true);
              form.setValue("turnstileToken", "", { shouldValidate: true });
            }}
            onExpire={() => {
              form.setValue("turnstileToken", "", { shouldValidate: true });
            }}
            options={{ theme: "light" }}
          />
        ) : (
          <p role="alert" className="rounded-md border border-[var(--color-destructive)]/30 bg-[var(--color-destructive)]/10 px-3 py-2 text-sm text-[var(--color-destructive)]">
            The contact form security check is not configured. Please email{" "}
            <a className="underline" href="mailto:kiattriumph@gmail.com">
              kiattriumph@gmail.com
            </a>{" "}
            directly.
          </p>
        )
      ) : null}

      {turnstileLoadError ? (
        <p role="alert" className="text-sm text-[var(--color-destructive)]">
          Security check failed to load. Refresh the page or email kiattriumph@gmail.com directly.
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting || (turnstileRequired && (!turnstileToken || turnstileUnavailable))}
      >
        {form.formState.isSubmitting ? "Submitting..." : "Send message"}
      </Button>

      {submitState === "success" ? (
        <p role="status" className="text-sm text-[var(--color-primary)]">
          Thank you. Your message has been received. You can expect a response within 1-3
          business days.
        </p>
      ) : null}
      {submitState === "error" ? (
        <p role="alert" className="text-sm text-[var(--color-destructive)]">
          {submitErrorMessage ?? "Submission failed. Please verify your details and try again."}
        </p>
      ) : null}
    </form>
  );
}
