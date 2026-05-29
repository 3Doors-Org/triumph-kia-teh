const EM_DASH = /—/;
const EMOJI = /\p{Extended_Pictographic}/u;

export type EditorialLintIssue = {
  field: string;
  message: string;
};

export function lintEditorialText(field: string, value: string): EditorialLintIssue[] {
  const issues: EditorialLintIssue[] = [];
  if (EM_DASH.test(value)) {
    issues.push({ field, message: "Em dashes are not permitted by editorial policy." });
  }
  if (EMOJI.test(value)) {
    issues.push({ field, message: "Emoji characters are not permitted by editorial policy." });
  }
  return issues;
}

export function assertEditorialText(field: string, value: string): void {
  const issues = lintEditorialText(field, value);
  if (issues.length === 0) {
    return;
  }
  const detail = issues.map((issue) => `${issue.field}: ${issue.message}`).join("; ");
  throw new Error(`Editorial lint failed: ${detail}`);
}
