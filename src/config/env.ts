type PublicEnv = {
  appUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
};

type ServerEnv = {
  supabaseServiceRoleKey: string;
  cronSecret: string;
};

function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  }

  return value;
}

function readOptionalEnv(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const publicEnv: PublicEnv = {
  appUrl: readRequiredEnv("NEXT_PUBLIC_APP_URL"),
  supabaseUrl: readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: readRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
};

export const serverEnv: ServerEnv = {
  supabaseServiceRoleKey: readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  cronSecret: readOptionalEnv("CRON_SECRET"),
};
