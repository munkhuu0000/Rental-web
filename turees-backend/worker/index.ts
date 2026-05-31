import handler from "vinext/server/app-router-entry";
import type { ExecutionContextLike } from "vinext/shims/request-context";
import { setRuntimeDb } from "../src/db";

type WorkerEnv = {
  ASSETS?: {
    fetch(request: Request): Promise<Response> | Response;
  };
  DB?: Parameters<typeof setRuntimeDb>[0];
};

const worker = {
  async fetch(
    request: Request,
    env: WorkerEnv,
    ctx: ExecutionContextLike,
  ): Promise<Response> {
    if (env.DB) {
      setRuntimeDb(env.DB);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
