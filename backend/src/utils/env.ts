import dotenv from 'dotenv';
dotenv.config();
import { z } from 'zod';

const EnvSchema = z.object({
	PORT: z.string().default('6001'),
	ALLOWED_ORIGIN: z.url().default('http://localhost:3000'),

	OPENAI_MODEL: z.string().default('gpt-4o-mini'),
	GOOGLE_MODEL: z.string().default('gemini-2.0-flash-lite'),

	OPENAI_API_KEY: z.string().optional(),
	GOOGLE_API_KEY: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
	throw new Error('Invalid environment variables');
}

const raw = parsed.data;

export const env = Object.freeze({
	PORT: Number(raw.PORT),
	ALLOWED_ORIGIN: raw.ALLOWED_ORIGIN,
	OPENAI_MODEL: raw.OPENAI_MODEL,
	GOOGLE_MODEL: raw.GOOGLE_MODEL,
	OPENAI_API_KEY: raw.OPENAI_API_KEY,
	GOOGLE_API_KEY: raw.GOOGLE_API_KEY,
});
