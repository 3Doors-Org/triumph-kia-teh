const DEPLOY_ENV_VALUES = ["development", "staging", "production"] as const;
type DeployEnv = (typeof DEPLOY_ENV_VALUES)[number];

export type R2Config = {
  accountId: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl: string;
};

export function getR2Config(): R2Config {
  const accountId = requireEnv("R2_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const publicBaseUrl = requireEnv("R2_PUBLIC_BASE_URL");
  const deployEnv = getDeployEnv();
  const bucket = resolveBucketForEnv(deployEnv);
  return {
    accountId,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl: publicBaseUrl.replace(/\/+$/, ""),
  };
}

function resolveBucketForEnv(deployEnv: DeployEnv): string {
  if (deployEnv === "production") {
    return requireEnv("R2_BUCKET_PROD");
  }
  if (deployEnv === "staging") {
    return requireEnv("R2_BUCKET_STAGING");
  }
  return process.env.R2_BUCKET_DEV || process.env.R2_BUCKET || "personal-website-dev-assets";
}

function getDeployEnv(): DeployEnv {
  const value = process.env.APP_DEPLOY_ENV ?? "development";
  if (DEPLOY_ENV_VALUES.includes(value as DeployEnv)) {
    return value as DeployEnv;
  }
  return "development";
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
