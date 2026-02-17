import path from "node:path";
import dotenv from "dotenv";

let hasInitializedEnv = false;

export function initializeEnv(): void {
  if (hasInitializedEnv) {
    return;
  }

  hasInitializedEnv = true;

  if (process.env.NODE_ENV === "development") {
    dotenv.config({
      path: path.resolve(process.cwd(), ".env.development")
    });
  }
}

export function getRequiredEnv(name: string): string {
  initializeEnv();

  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}
