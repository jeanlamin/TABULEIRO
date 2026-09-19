import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getEnv } from "@/infrastructure/config/env";

export interface Session {
  readonly userId: string;
  readonly email: string | null;
}

/**
 * Prepared session lookup for a future single-user login flow. Not called
 * from any route or component in this slice — there is no login page yet.
 */
export async function getServerSession(): Promise<Session | null> {
  const env = getEnv();
  const cookieStore = await cookies();

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {
        // Session refresh is not wired up in this slice.
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return null;
  }

  return { userId: data.user.id, email: data.user.email ?? null };
}
