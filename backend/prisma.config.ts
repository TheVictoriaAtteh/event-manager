import 'dotenv/config';
import { defineConfig } from '@prisma/config';

/**
 * Prisma 7 CLI configuration.
 *
 * `prisma generate` only reads the schema, but Prisma still evaluates this
 * config. A local placeholder keeps generation and CI builds independent of
 * database credentials. Runtime connections remain fail-fast in
 * PrismaService, and migration commands should always receive DATABASE_URL.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/event_manager',
  },
});
