import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export function createBrowserSupabase() {
  if (!url || !key) {
    throw new Error("Supabase env vars are not configured");
  }
  return createClient(url, key);
}
