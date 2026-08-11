import dotenv from 'dotenv';
dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET', 'GROQ_API_KEY'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`\n❌  Missing required env var: ${key}`);
    console.error('   Copy .env.example → .env and fill in the values.\n');
    process.exit(1);
  }
}

export default {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  PORT: parseInt(process.env.PORT || '5000', 10),
  AUDIO_STORAGE_PATH: process.env.AUDIO_STORAGE_PATH || './uploads',
};
