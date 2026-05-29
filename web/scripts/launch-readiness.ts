import { mkdir, writeFile } from "node:fs/promises";
import { URL } from "node:url";

type CheckResult = {
  name: string;
  ok: boolean;
  detail: string;
};

type ReadinessReport = {
  generatedAt: string;
  baseUrl: string;
  checks: CheckResult[];
};

const REQUIRED_SECURITY_HEADERS = [
  "content-security-policy",
  "strict-transport-security",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
] as const;

function parseArg(name: string): string | undefined {
  const direct = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (direct) {
    return direct.slice(name.length + 1).trim();
  }

  const index = process.argv.findIndex((arg) => arg === name);
  if (index !== -1 && process.argv[index + 1]) {
    return process.argv[index + 1].trim();
  }

  return undefined;
}

async function checkPath(baseUrl: URL, path: string): Promise<CheckResult> {
  const url = new URL(path, baseUrl);
  const response = await fetch(url.toString(), { method: "GET", redirect: "manual" });
  const ok = response.status >= 200 && response.status < 400;
  return {
    name: `GET ${path}`,
    ok,
    detail: `status=${response.status}`,
  };
}

async function checkHttpsRedirect(baseUrl: URL): Promise<CheckResult> {
  if (baseUrl.protocol !== "https:") {
    return {
      name: "HTTP -> HTTPS redirect",
      ok: true,
      detail: "skipped (base URL is not HTTPS)",
    };
  }

  const httpUrl = new URL(baseUrl.toString());
  httpUrl.protocol = "http:";
  const response = await fetch(httpUrl.toString(), { method: "GET", redirect: "manual" });
  const location = response.headers.get("location") ?? "";
  const ok = [301, 302, 307, 308].includes(response.status) && location.startsWith("https://");
  return {
    name: "HTTP -> HTTPS redirect",
    ok,
    detail: `status=${response.status}; location=${location || "none"}`,
  };
}

async function checkSecurityHeaders(baseUrl: URL): Promise<CheckResult[]> {
  const isLocalHost =
    baseUrl.hostname === "localhost" || baseUrl.hostname === "127.0.0.1";
  if (isLocalHost) {
    return REQUIRED_SECURITY_HEADERS.map((header) => ({
      name: `Header ${header}`,
      ok: true,
      detail: "skipped (localhost)",
    }));
  }

  const response = await fetch(baseUrl.toString(), { method: "GET", redirect: "manual" });
  return REQUIRED_SECURITY_HEADERS.map((header) => {
    const value = response.headers.get(header);
    return {
      name: `Header ${header}`,
      ok: Boolean(value),
      detail: value ? "present" : "missing",
    };
  });
}

async function main() {
  const baseUrlRaw = parseArg("--base-url") ?? process.env.LAUNCH_BASE_URL ?? "http://127.0.0.1:3000";
  const deepPath = parseArg("--deep-path") ?? process.env.LAUNCH_DEEP_PATH ?? "/writing";
  const baseUrl = new URL(baseUrlRaw);

  const checks: CheckResult[] = [];
  checks.push(await checkPath(baseUrl, "/"));
  checks.push(await checkPath(baseUrl, "/contact"));
  checks.push(await checkPath(baseUrl, "/admin/login"));
  checks.push(await checkPath(baseUrl, deepPath));
  checks.push(await checkHttpsRedirect(baseUrl));
  checks.push(...(await checkSecurityHeaders(baseUrl)));

  const report: ReadinessReport = {
    generatedAt: new Date().toISOString(),
    baseUrl: baseUrl.toString(),
    checks,
  };

  await mkdir(".reports", { recursive: true });
  await writeFile(".reports/launch-readiness.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const failures = checks.filter((check) => !check.ok);
  for (const check of checks) {
    const prefix = check.ok ? "PASS" : "FAIL";
    console.log(`[${prefix}] ${check.name} (${check.detail})`);
  }

  if (failures.length > 0) {
    console.error(`Launch readiness checks failed: ${failures.length}`);
    process.exitCode = 1;
    return;
  }

  console.log("Launch readiness checks passed.");
}

void main();
