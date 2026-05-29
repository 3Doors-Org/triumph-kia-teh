import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { routes } from "../src/lib/routes";

const SRC_ROOT = join(process.cwd(), "src");
const FILE_EXTENSIONS = [".tsx", ".ts"];

const KNOWN_PATHS = new Set<string>(
  Object.values(routes.public)
    .filter((value) => typeof value === "string")
    .concat(
      Object.values(routes.admin).filter((value) => typeof value === "string"),
      Object.values(routes.dev).filter((value) => typeof value === "string"),
    ),
);

const DYNAMIC_PREFIXES = ["/organizations/", "/writing/", "/research/", "/admin/"];

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const absolute = join(dir, entry);
    const stats = statSync(absolute);
    if (stats.isDirectory()) {
      walk(absolute, acc);
      continue;
    }
    if (FILE_EXTENSIONS.some((ext) => absolute.endsWith(ext))) {
      acc.push(absolute);
    }
  }
  return acc;
}

function isValidInternalPath(pathname: string) {
  if (KNOWN_PATHS.has(pathname)) {
    return true;
  }
  return DYNAMIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function collectBrokenLinks() {
  const broken: Array<{ file: string; href: string }> = [];
  const files = walk(SRC_ROOT);
  const hrefRegex = /href\s*=\s*["'`]\/[^"'`]*["'`]/g;

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const matches = content.match(hrefRegex);
    if (!matches) {
      continue;
    }
    for (const raw of matches) {
      const href = raw.split("=")[1]?.trim().slice(1, -1);
      if (!href || href.startsWith("/api/")) {
        continue;
      }
      const [pathname] = href.split("?");
      if (!pathname || !isValidInternalPath(pathname)) {
        broken.push({ file, href });
      }
    }
  }
  return broken;
}

const brokenLinks = collectBrokenLinks();
if (brokenLinks.length > 0) {
  console.error("Found unknown internal href values:");
  for (const link of brokenLinks) {
    console.error(`- ${link.href} in ${link.file}`);
  }
  process.exit(1);
}

console.log("Internal link validation passed.");
