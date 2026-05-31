import fs from "node:fs";
import os from "node:os";
import path from "node:path";

if (process.platform === "win32") {
  const projectDir = process.cwd();
  const linkPath = path.join(projectDir, ".next");
  const targetPath = getCachePath();
  const projectNodeModules = path.join(projectDir, "node_modules");
  const cacheNodeModules = path.join(targetPath, "node_modules");

  let shouldCreateCacheLink = true;

  if (fs.existsSync(linkPath)) {
    const stat = fs.lstatSync(linkPath);

    if (stat.isSymbolicLink()) {
      const currentTarget = normalizePath(fs.readlinkSync(linkPath));
      const expectedTarget = normalizePath(targetPath);

      if (currentTarget === expectedTarget) {
        shouldCreateCacheLink = false;
      } else {
        fs.rmSync(linkPath, { force: true });
      }
    } else {
      const backupPath = path.join(
        projectDir,
        `.next.backup.${new Date().toISOString().replace(/[:.]/g, "-")}`,
      );

      try {
        fs.renameSync(linkPath, backupPath);
      } catch (error) {
        if (error?.code === "EPERM" || error?.code === "EBUSY") {
          throw new Error(
            "Could not move .next because it is locked. Stop the running Next.js dev server, then run npm run dev again.",
          );
        }

        throw error;
      }

      console.log(`Moved existing .next cache to ${backupPath}`);
    }
  }

  if (shouldCreateCacheLink) {
    fs.symlinkSync(targetPath, linkPath, "junction");
    console.log(`Using local Next.js cache at ${targetPath}`);
  }

  ensureCacheNodeModulesLink();

  function getCachePath() {
    const candidates = process.env.NEXT_LOCAL_CACHE_DIR
      ? [process.env.NEXT_LOCAL_CACHE_DIR]
      : [
          path.join(projectDir, ".next-local-cache"),
          "C:\\tmp\\turees-front-next-cache",
          path.join(os.tmpdir(), "turees-front-next-cache"),
        ];

    for (const candidate of candidates) {
      try {
        fs.mkdirSync(candidate, { recursive: true });
        return candidate;
      } catch {
        // Try the next local cache candidate.
      }
    }

    throw new Error(
      "Could not create a local Next.js cache directory. Set NEXT_LOCAL_CACHE_DIR to a writable local path.",
    );
  }

  function ensureCacheNodeModulesLink() {
    if (!fs.existsSync(projectNodeModules)) {
      return;
    }

    if (fs.existsSync(cacheNodeModules)) {
      const stat = fs.lstatSync(cacheNodeModules);

      if (stat.isSymbolicLink()) {
        const currentTarget = normalizePath(fs.readlinkSync(cacheNodeModules));
        const expectedTarget = normalizePath(projectNodeModules);

        if (currentTarget === expectedTarget) {
          return;
        }

        fs.rmSync(cacheNodeModules, { force: true });
      } else {
        throw new Error(
          `${cacheNodeModules} already exists and is not a link. Remove it or set NEXT_LOCAL_CACHE_DIR to a clean writable path.`,
        );
      }
    }

    try {
      fs.symlinkSync(projectNodeModules, cacheNodeModules, "junction");
    } catch (error) {
      if (error?.code === "EPERM") {
        console.warn(
          `Could not link ${cacheNodeModules}. Falling back to NODE_PATH for module resolution.`,
        );
        return;
      }

      throw error;
    }
  }

  function normalizePath(value) {
    return path.resolve(value).toLocaleLowerCase("en-US");
  }
}
