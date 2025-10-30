import { defineConfig, env } from 'prisma/config';
import { config } from 'dotenv';

// 환경 변수 로드
config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
