import { sanitizeHtml } from "@/lib/security/sanitize-html";

type TipTapMark = {
  type?: string;
  attrs?: Record<string, unknown>;
};

type TipTapNode = {
  type?: string;
  text?: string;
  marks?: TipTapMark[];
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
};

export type RenderedPostBody = {
  html: string;
  plainText: string;
  readingTimeMinutes: number;
};

const WORDS_PER_MINUTE = 220;

export function renderPostBody(bodyJson: unknown): RenderedPostBody {
  const root = isTipTapNode(bodyJson) ? bodyJson : null;
  const content = root?.type === "doc" ? root.content ?? [] : [];
  const dirtyHtml = content.map(renderBlockNode).join("\n");
  const sanitizedHtml = sanitizeRichTextHtml(dirtyHtml.length > 0 ? dirtyHtml : "<p></p>");
  const normalizedHtml = enforceSafeAnchorAttrs(sanitizedHtml);
  const plainText = htmlToPlainText(normalizedHtml);
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount(plainText) / WORDS_PER_MINUTE));

  return {
    html: normalizedHtml,
    plainText,
    readingTimeMinutes,
  };
}

export function sanitizeRichTextHtml(html: string): string {
  return sanitizeHtml(html, "rich-content");
}

function renderBlockNode(node: TipTapNode): string {
  const type = node.type ?? "";
  if (type === "paragraph") {
    return `<p>${renderInlineContent(node.content)}</p>`;
  }
  if (type === "heading") {
    const level = normalizeHeadingLevel(node.attrs?.level);
    return `<h${level}>${renderInlineContent(node.content)}</h${level}>`;
  }
  if (type === "bulletList") {
    return `<ul>${renderListItems(node.content)}</ul>`;
  }
  if (type === "orderedList") {
    return `<ol>${renderListItems(node.content)}</ol>`;
  }
  if (type === "blockquote") {
    return `<blockquote>${(node.content ?? []).map(renderBlockNode).join("")}</blockquote>`;
  }
  if (type === "horizontalRule") {
    return "<hr>";
  }
  if (type === "codeBlock") {
    const text = flattenText(node.content ?? []);
    return `<pre><code>${escapeHtml(text)}</code></pre>`;
  }

  return "";
}

function renderListItems(nodes: TipTapNode[] | undefined): string {
  if (!nodes || nodes.length === 0) {
    return "";
  }

  return nodes
    .filter((node) => node.type === "listItem")
    .map((item) => `<li>${(item.content ?? []).map(renderBlockNode).join("")}</li>`)
    .join("");
}

function renderInlineContent(nodes: TipTapNode[] | undefined): string {
  if (!nodes || nodes.length === 0) {
    return "";
  }

  return nodes
    .map((node) => {
      if (node.type === "text") {
        return applyMarks(escapeHtml(node.text ?? ""), node.marks);
      }
      if (node.type === "hardBreak") {
        return "<br>";
      }
      return "";
    })
    .join("");
}

function applyMarks(text: string, marks: TipTapMark[] | undefined): string {
  if (!marks || marks.length === 0) {
    return text;
  }

  return marks.reduce((acc, mark) => {
    if (mark.type === "bold") {
      return `<strong>${acc}</strong>`;
    }
    if (mark.type === "italic") {
      return `<em>${acc}</em>`;
    }
    if (mark.type === "underline") {
      return `<u>${acc}</u>`;
    }
    if (mark.type === "strike") {
      return `<s>${acc}</s>`;
    }
    if (mark.type === "code") {
      return `<code>${acc}</code>`;
    }
    if (mark.type === "link") {
      const href = normalizeHref(mark.attrs?.href);
      const target = mark.attrs?.target === "_blank" ? '_blank' : '_self';
      const rel = target === "_blank" ? "noopener noreferrer nofollow" : "nofollow";
      return `<a href="${escapeAttribute(href)}" target="${target}" rel="${rel}">${acc}</a>`;
    }

    return acc;
  }, text);
}

function normalizeHeadingLevel(value: unknown): 2 | 3 {
  if (value === 2 || value === 3) {
    return value;
  }
  return 2;
}

function normalizeHref(value: unknown): string {
  if (typeof value !== "string") {
    return "#";
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "#";
  }

  if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) {
      return url.toString();
    }
  } catch {
    return "#";
  }

  return "#";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string): string {
  return value.replaceAll('"', "&quot;");
}

function isTipTapNode(value: unknown): value is TipTapNode {
  return typeof value === "object" && value !== null;
}

function flattenText(nodes: TipTapNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === "text") {
        return node.text ?? "";
      }
      if (node.content) {
        return flattenText(node.content);
      }
      return "";
    })
    .join(" ")
    .trim();
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function enforceSafeAnchorAttrs(html: string): string {
  return html.replace(/<a href=\"([^\"]+)\"[^>]*>/g, (_match, href: string) => {
    const isExternal = href.startsWith("http://") || href.startsWith("https://");
    if (isExternal) {
      return `<a href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer nofollow">`;
    }
    return `<a href="${escapeAttribute(href)}" rel="nofollow">`;
  });
}

function wordCount(text: string): number {
  if (text.length === 0) {
    return 0;
  }
  return text.split(" ").filter(Boolean).length;
}
