export const basePath = "";

export function getAssetPath(path: string) {
  if (!path.startsWith("/")) return `${basePath}/${path}`;
  return `${basePath}${path}`;
}

