import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string(),
  VITE_GRAPHQL_URI: z.string().url(),
  VITE_APP_NAME: z.string().default('Enterprise App'),
  VITE_TOKEN_REFRESH_THRESHOLD: z.string().transform(Number).default('300000'),
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
});

const parseEnv = () => {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
};

export const env = parseEnv();

export const config = {
  api: {
    baseURL: env.VITE_API_BASE_URL,
    graphqlURI: env.VITE_GRAPHQL_URI,
    timeout: 30000,
    tokenRefreshThreshold: env.VITE_TOKEN_REFRESH_THRESHOLD,
  },
  app: {
    name: env.VITE_APP_NAME,
  },
} as const;
