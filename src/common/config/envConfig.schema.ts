import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const envConfigSchema = z.object({
  APP_PORT: z
    .string()
    .transform((port) => parseInt(port, 10))
    .default('3000'),
  API_GLOBAL_PREFIX: z.string().default('api'),
  LOGGING_LEVEL: z.string().default('info'),
  SERVICE_NAME: z.string().default('florist-cloud'),
  APP_VERSION: z.string().default('0.0.1'),
  NODE_ENV: z.string().default('develop'),

  DATABASE_URL: z.string(),
  TELEGRAM_BOT_COMPLIMENT_CREATOR_TOKEN: z.string(),
  TELEGRAM_BOT_COMPLIMENT_RECEIPENT_TOKEN: z.string(),
});

export type EnvConfigSchema = z.infer<typeof envConfigSchema>;
export class Env extends createZodDto(envConfigSchema) {}
