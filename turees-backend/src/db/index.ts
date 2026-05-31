import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type DatabaseBinding = Parameters<typeof drizzle>[0];
let runtimeDb: DatabaseBinding | null = null;

export const drizzleProvider = (db: DatabaseBinding) => {
  return drizzle(db, { schema });
};

export const setRuntimeDb = (db: DatabaseBinding) => {
  runtimeDb = db;
};

export const getRuntimeDb = () => {
  return runtimeDb;
};
