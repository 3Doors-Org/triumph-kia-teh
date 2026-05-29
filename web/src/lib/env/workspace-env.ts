import { config } from "dotenv";
import { resolve } from "node:path";

export function loadWorkspaceEnvFiles(cwd: string = process.cwd()) {
  config({ path: resolve(cwd, "../.env") });
  config({ path: resolve(cwd, ".env") });
}
