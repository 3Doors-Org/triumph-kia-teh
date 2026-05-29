import DOMPurify from "isomorphic-dompurify";

export const SANITIZE_HTML_POLICY_VERSION = "2026-05-07.v1";

const RICH_CONTENT_ALLOWED_TAGS = [
  "p",
  "br",
  "h2",
  "h3",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "hr",
  "code",
  "pre",
] as const;

const RICH_CONTENT_ALLOWED_ATTRS = ["href", "target", "rel"] as const;

type SanitizePolicy = "rich-content";

export function sanitizeHtml(input: string, policy: SanitizePolicy = "rich-content"): string {
  if (policy !== "rich-content") {
    return "";
  }

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [...RICH_CONTENT_ALLOWED_TAGS],
    ALLOWED_ATTR: [...RICH_CONTENT_ALLOWED_ATTRS],
    FORBID_ATTR: ["style", "id", "onerror", "onload", "onclick"],
    FORBID_TAGS: [
      "script",
      "object",
      "embed",
      "form",
      "input",
      "button",
      "iframe",
      "frame",
      "link",
      "meta",
      "svg",
      "math",
    ],
    FORCE_BODY: true,
    WHOLE_DOCUMENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|\/|#)/i,
  });
}
