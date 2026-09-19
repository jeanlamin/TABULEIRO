import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { getEnv } from "@/infrastructure/config/env";

/**
 * Intentionally empty. The Foundation schema (objects, relations, ...) has
 * not been migrated yet — see docs/foundation-decisions.md. Extending this
 * interface is how the next slice wires real tables into Kysely's types.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Database {}

let instance: Kysely<Database> | undefined;

/**
 * Lazily creates the pooled Kysely connection. Not called anywhere in this
 * slice — no Command/Query exists yet to use it.
 */
export function getDb(): Kysely<Database> {
  if (!instance) {
    const env = getEnv();
    instance = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({ connectionString: env.databaseUrl }),
      }),
    });
  }
  return instance;
}
