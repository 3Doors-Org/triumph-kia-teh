import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const BUDGETS = {
  totalInitialJsBytesWarn: 650 * 1024,
  maxChunkBytesWarn: 220 * 1024,
} as const;

async function listJsFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listJsFiles(resolved)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(resolved);
    }
  }
  return files;
}

async function main() {
  const chunksDir = path.join(process.cwd(), ".next", "static", "chunks");
  const jsFiles = await listJsFiles(chunksDir);
  let totalBytes = 0;
  let maxChunkBytes = 0;
  let maxChunkPath = "";

  for (const file of jsFiles) {
    const fileStat = await stat(file);
    totalBytes += fileStat.size;
    if (fileStat.size > maxChunkBytes) {
      maxChunkBytes = fileStat.size;
      maxChunkPath = file;
    }
  }

  const warnings: string[] = [];
  if (totalBytes > BUDGETS.totalInitialJsBytesWarn) {
    warnings.push(
      `Total JS chunk size ${formatBytes(totalBytes)} exceeds warning budget ${formatBytes(BUDGETS.totalInitialJsBytesWarn)}.`,
    );
  }
  if (maxChunkBytes > BUDGETS.maxChunkBytesWarn) {
    warnings.push(
      `Largest JS chunk ${formatBytes(maxChunkBytes)} (${path.basename(maxChunkPath)}) exceeds warning budget ${formatBytes(BUDGETS.maxChunkBytesWarn)}.`,
    );
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalBytes,
    maxChunkBytes,
    maxChunkFile: path.basename(maxChunkPath),
    warnings,
  };
  await mkdir(path.join(process.cwd(), ".reports"), { recursive: true });
  await writeFile(
    path.join(process.cwd(), ".reports", "bundle-budget.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );

  const baselinePath = process.env.BUNDLE_BASELINE_PATH;
  if (baselinePath) {
    const baseline = await readBaseline(baselinePath);
    if (baseline) {
      const deltaBytes = totalBytes - baseline.totalBytes;
      console.log(
        `[bundle-budget][delta] total=${formatSigned(deltaBytes)} (${formatBytes(Math.abs(deltaBytes))})`,
      );
    }
  }

  console.log(
    `[bundle-budget] total=${formatBytes(totalBytes)} maxChunk=${formatBytes(maxChunkBytes)} file=${path.basename(maxChunkPath)}`,
  );
  if (warnings.length > 0) {
    for (const warning of warnings) {
      console.warn(`[bundle-budget][warn] ${warning}`);
    }
  }
}

type BundleBaseline = {
  totalBytes: number;
};

async function readBaseline(baselinePath: string): Promise<BundleBaseline | null> {
  try {
    const raw = await readFile(path.resolve(process.cwd(), baselinePath), "utf8");
    const parsed = JSON.parse(raw) as Partial<BundleBaseline>;
    return typeof parsed.totalBytes === "number" ? { totalBytes: parsed.totalBytes } : null;
  } catch {
    return null;
  }
}

function formatBytes(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

void main().catch((error) => {
  console.error("[bundle-budget][error]", error);
  process.exitCode = 1;
});
