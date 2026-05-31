import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const cachePaths = [
  path.join(projectDir, ".next-local-cache", "dev"),
  path.join(projectDir, ".next-local-cache", "cache"),
];

for (const cachePath of cachePaths) {
  if (!fs.existsSync(cachePath)) {
    continue;
  }

  try {
    fs.rmSync(cachePath, { recursive: true, force: true });
    console.log(`Removed ${cachePath}`);
  } catch (error) {
    if (error?.code === "EPERM" || error?.code === "EBUSY") {
      throw new Error(
        "Could not clear the Next.js cache because it is locked. Stop the running dev server, then run this command again.",
      );
    }

    throw error;
  }
}
