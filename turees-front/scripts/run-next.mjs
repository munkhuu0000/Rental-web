import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import "./ensure-next-cache.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const nodeModules = path.join(projectDir, "node_modules");
const nextCli = path.join(nodeModules, "next", "dist", "bin", "next");
const nextArgs = process.argv.slice(2);
const existingNodePath = process.env.NODE_PATH;
const env = {
  ...process.env,
  NODE_PATH: existingNodePath
    ? `${nodeModules}${path.delimiter}${existingNodePath}`
    : nodeModules,
};
const child = spawn(process.execPath, [nextCli, ...nextArgs], {
  cwd: projectDir,
  env,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
