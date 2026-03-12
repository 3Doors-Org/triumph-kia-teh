export const basePath = "/triumph-kia-teh";

export function getAssetPath(path: string) {
  if (!path.startsWith("/")) return `${basePath}/${path}`;
  return `${basePath}${path}`;
}

