import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        // Return a mock client during build time
        return {
            auth: {
                signInWithPassword: async () => ({ data: null, error: { message: "Supabase not configured" } }),
                signUp: async () => ({ data: null, error: { message: "Supabase not configured" } }),
                signInWithOAuth: async () => ({ data: null, error: { message: "Supabase not configured" } }),
                signOut: async () => ({ error: null }),
                getUser: async () => ({ data: { user: null }, error: null }),
                getSession: async () => ({ data: { session: null }, error: null }),
            },
            from: () => ({
                select: () => ({ data: null, error: null }),
                insert: () => ({ data: null, error: null }),
                update: () => ({ data: null, error: null, eq: () => ({ data: null, error: null }) }),
                delete: () => ({ data: null, error: null }),
            }),
        } as any;
    }

    return createBrowserClient(url, key);
}
