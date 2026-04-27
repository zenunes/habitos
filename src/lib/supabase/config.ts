import { publicEnv, serverEnv } from "@/config/env";

export function getSupabasePublicConfig() {
  return { 
    url: publicEnv.supabaseUrl, 
    anonKey: publicEnv.supabaseAnonKey 
  };
}

export function getSupabaseServiceRoleKey() {
  return serverEnv.supabaseServiceRoleKey;
}
