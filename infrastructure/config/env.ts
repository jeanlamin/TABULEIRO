export interface Env {
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
  readonly supabaseServiceRoleKey: string | undefined;
  readonly databaseUrl: string;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Reads and validates process.env on demand. Not called at module load time
 * anywhere in this slice, so the app builds without real env values until a
 * Command/Query actually needs them.
 */
export function getEnv(): Env {
  return {
    supabaseUrl: required("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    databaseUrl: required("DATABASE_URL"),
  };
}
