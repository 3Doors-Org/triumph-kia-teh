const allowedTargets = new Set(["writing", "research", "communityImpact"]);

type RevalidateTarget = "writing" | "research" | "communityImpact";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

async function main() {
  const baseUrl = requireEnv("REVALIDATE_BASE_URL").replace(/\/+$/, "");
  const secret = requireEnv("INTERNAL_REVALIDATE_SECRET");

  const targetArg = process.argv[2];
  if (!targetArg || !allowedTargets.has(targetArg)) {
    throw new Error("Usage: pnpm revalidate:content <writing|research|communityImpact> [slug]");
  }

  const target = targetArg as RevalidateTarget;
  const slug = process.argv[3];

  const startedAt = Date.now();
  const response = await fetch(`${baseUrl}/api/internal/revalidate-content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-revalidate-secret": secret,
    },
    body: JSON.stringify({ target, slug }),
  });
  const body = await response.text();
  const elapsedMs = Date.now() - startedAt;

  if (!response.ok) {
    throw new Error(`Revalidate failed (${response.status}): ${body}`);
  }

  console.log(`Revalidate completed in ${elapsedMs}ms`);
  console.log(body);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
